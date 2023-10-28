import fs from 'fs'
import { Request } from 'undici';
import { Client,Constants, EmbedBuilder, Events,IntentsBitField } from 'discord.js'
import express from 'express'
import bodyParser from 'body-parser';
import { useSelector } from 'react-redux';
import fetch from 'node-fetch';
import axios from 'axios';
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  const guildId = '1164532540405723166'; // Zaktualizuj na ID swojego serwera

  const channelID = "1163867019536519168"
  
  client.guilds.cache.get(guildId)?.commands.create({
    name: 'grabber',
    description: 'Pobierz informacje geolokalizacyjne',
  });
  client.user.setActivity('is Development');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const channelID = "1163867019536519168"; // ID kanału powitalnego

  const name = interaction.commandName;
  
  if (name === 'grabber') {
    const channel = interaction.guild.channels.cache.get(channelID);
    interaction.reply("test")
  }
})

client.on("guildMemberAvailable", (member) => {
  const channelID = "1164589733536608306"; // ID kanału powitalnego

  const message = `Witaj na serwerze, <@${member.user.id}>!`;

  const channel = member.guild.channels.cache.get(channelID);
  console.log('dziala')
  if (channel) {
    channel.send(message);
  }

  const dmMessage = `Witamy na ${member.guild.name}, ${member.user.tag}!`;
  member.send(dmMessage).catch((err) => {
    console.error(err);
  });
});




client.login("MTE2NDQ2ODE3MTE5Mzk4Mjk3Ng.GO9mhZ.lAi3oPtTroaNxAOL8wJPvDQaOb9lmc9vWZwT9A")