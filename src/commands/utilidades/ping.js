const mongoose = require("mongoose");

module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Muestra el ping del bot y de la API.',
    cooldown: 10,
    args: false,
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        const start = Date.now();
        await mongoose.connection.db.collection("guilds").findOne({});
        const end = Date.now();
        const embed = Utils.embed(message.author, {
            "title": '🏓Pong',
            "description": `> Ping: ${end - message.createdTimestamp}ms.\n > API Ping: ${Math.round(await client.ws.ping)}ms. \n > DB Ping: ${end - start}ms.`
        }) 

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("sample")
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel("Boton de Prueba")
        )

        message.channel.send({ embeds: [embed], components: [row]  });
    },
};
