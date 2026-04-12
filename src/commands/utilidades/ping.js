module.exports = {
    name: 'ping',
    aliases: ["p"],
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        const embed = Utils.embed(message.author, {
            "title": '🏓Pong',
            "description": `> Ping: ${Date.now() - message.createdTimestamp}ms.\n > API Ping: ${Math.round(await client.ws.ping)}ms.`
        }) 

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("sample")
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel("el diavlo")
        )

        message.channel.send({ embeds: [embed], components: [row]  });
    },
};
