const mongoose = require("mongoose");

module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
  },
  cooldown: 10,
  async execute(interaction, client, Utils, Discord) {
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
    interaction.reply({ embeds: [embed], components: [row]  });
  }
}