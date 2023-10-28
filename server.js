import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { Client, EmbedBuilder, Events,IntentsBitField } from 'discord.js'

const app = express();

let users = JSON.parse(fs.readFileSync("./data.json"));
let annouces = JSON.parse(fs.readFileSync("./announces.json"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });
client.once('ready',()=>{
  console.log(`Zalogowano jako ${client.user.tag}`);

})
app.get("/users", (req, res) => {
  res.status(200).json({
    data: users,
  });
});
app.get("/admin/read/:id",(req,res)=>{
  let user = users.find((e) => e.id == req.params.id);
  console.log('znaleziono')
  res.status(200).json({
    data:user
  })
})

app.get("/annouces", (req, res) => {
  res.status(200).json({
    data: annouces,
  });
}); 
app.post("/annouces", (req, res) => {
  try {
    let id = annouces.length + 1; // Zamiast users.length

    let newannouce = Object.assign({ id: id }, req.body);
        const channel = client.channels.cache.get('1164529688295768084'); // Zastąp ID_KANAŁU odpowiednim ID kanału

    annouces.push(newannouce); // Zamiast users.pus   message.channel.send({
    let date = new Date();

    newannouce.discord ? channel.send({
    embeds:[new EmbedBuilder()
      .setDescription(newannouce.opis)
      .setTitle(`${newannouce.title}`)
      .setAuthor({
        name:client.user.tag,
        iconURL:client.user.defaultAvatarURL
      })
      .setColor("Red")
      .setFooter({ text: `Ogłoszenie z dnia ${date.getDay()}:${date.getMonth()}:${date.getFullYear()}`, iconURL: client.user.defaultAvatarURL })
      
    ]
  }) : null
   
    fs.writeFile("./announces.json", JSON.stringify(annouces), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Błąd serwera podczas zapisywania ogłoszenia.",
        });
      } else {
        res.status(201).json({
          status: "success",
          data: {
            annouces: newannouce,
          },
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Wystąpił nieoczekiwany błąd serwera.",
    });
  }
});

app.put('/admin/update/:id',(req,res)=>{
  let user = users.find((e)=>e.id == req.params.id);
  const {username, email, password, dcname, stats} = req.body; 
  const newUser = {
    id: user.id,
    email: email,
    username: username,
    password: password,
    roles: user.roles,
    dcname: dcname,
    stats: {
      level:stats.level,
      rank:stats.rank
    }
  }

  user = newUser;
  fs.writeFile('./data.json',JSON.stringify(users),(er)=>{
      res.status(201).json({
          data:user
      })
  })
})

app.put('/users/update/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, password, dcname, stats } = req.body;

  // Znajdź indeks użytkownika w tablicy users
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    return; 
  }
    const channel = client.channels.cache.get('1164529688295768084'); // Zastąp ID_KANAŁU odpowiednim ID kanału
  // if(dcname != users[userIndex].dcname) {
  //   const userToPromote = client.users.cache.find(user => user.displayName == "danyPL");
    
  //   channel.send(`nazwa użytkownika ${userToPromote.username}`);
  //   console.log(userToPromote.username)
  // }
  const userToPromote = client.users.cache.find(user => user.displayName == "danyPL");

  if (userToPromote) {
    channel.send(`nazwa użytkownika ${userToPromote.username}`);
    console.log(userToPromote.username);
   } else {
    console.log('Użytkownik o nazwie display "danyPL" nie został znaleziony');
   }
  // Zaktualizuj dane użytkownika
  users[userIndex] = {
    id: userId,
    email: email,
    username: username,
    password: password,
    roles: users[userIndex].roles, // Zachowaj istniejące role
    dcname: dcname,
    stats: {
      level: stats.level,
      rank: stats.rank,
    },
  };


    
  
  // Zapisz zmienione dane do pliku JSON
  fs.writeFile('./data.json', JSON.stringify(users), (err) => {
    if (err) {
      res.status(500).json({ error: 'Wystąpił błąd podczas zapisywania danych' });
    } else {
      res.status(200).json({
        data: users[userIndex], // Zwróć zaktualizowanego użytkownika
      });
    }
  });
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  console.log(password)
  let user = users.find((e) => e.username === username);

  if (user && user.password === password) {
    console.log("Znaleziono");
    res.status(200).json({
      status: "Znalezione",
      username: username,
      email: user.email,
      roles: user.roles,
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "Incorrect username or password",
    });
  }
});

app.post("/users/register", (req, res) => {
  const { email, username, password } = req.body;
  try {
    let userexist = users.find((e) => e.email === email);
    if (!userexist) {
      let id = users.length + 1;
      let user = {
        id: id,
        email: email,
        username: username,
        password: password,
        roles: ['user'],
        stats: {
          level: 0,
          rank: "Nowicjusz",
        },
      };

      users.push(user);
      fs.writeFile("./data.json", JSON.stringify(users), (err) => {
        res.status(201).json({
          status: "success",
          user,
        });
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Email is already taken",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

app.put("/users/:id", (req, res) => {
  let user = users.find((e) => e.id == req.params.id);
  const { name, duration } = req.body;
  user.name = name;
  user.duration = duration;
  fs.writeFile("./data.json", JSON.stringify(users), (er) => {
    res.status(201).json({
      data: user,
    });
  });
});
app.post("/users", (req, res) => {
  let id = users.length + 1;

  let newuser = Object.assign({ id: id }, req.body);

  users.push(newuser);
  fs.writeFile("./data.json", JSON.stringify(users), (er) => {
    res.status(201).json({
      status: "succes",
      data: {
        users: newuser,
      },
    });
  });
});

app.listen(3001, () => {
  console.log("serwer dziala");
  client.login("MTE2MzUzNjUyODQ5NzE4MDY4Mw.G0B6R-.nXgGTUYC4qvbQVhlQ-1Ztsb5AGauJcnIbq4bLg")
});
