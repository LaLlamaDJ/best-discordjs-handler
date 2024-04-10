const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'ping',
    aliases: ["p"],
    async execute(message, args, MessageEmbed, Util, client){
        const embed = new EmbedBuilder()
            .setTitle('Pong 🏓')
            .setDescription(`Mi ping es de ${client.ws.ping}ms`)

            const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("sample")
                .setStyle(ButtonStyle.Primary)
                .setLabel("el diavlo")
            )

        message.channel.send({ embeds: [embed], components: [row]  });
    },
};
