export default client =>{
        client.on("guildMemberAdd",member=>{
            
            const channelID = "1163867019536519168";
            console.log(member)

            const message = `**Witaj na serwerze, <@${member.id}>| **`;

            const channel = member.guild.channels.cache.get(channelID);

            channel.send(message);
            
            const dmMessage = `Witamy w ${message.guild.name},${member}`
            member.send(dmMessage).catch(err=>{
                return;
            })
        })
}