module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Muestra el ping del bot y de la API.',
    cooldown: 10,
    args: false,
    async execute(ctx, args, parsedArgs, client, Utils, Discord) {
        const embed = Utils.embed(ctx.user, {
            "title": '🏓Pong',
            "description": `> Ping: ${Date.now() - (ctx.createdTimestamp ?? ctx.raw.createdTimestamp)}ms.\n > API Ping: ${Math.round(await client.ws.ping)}ms.`
        }) 

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("sample")
            .setStyle(Discord.ButtonStyle.Primary)
            .setLabel("Boton de Prueba")
        )

        ctx.reply({ embeds: [embed], components: [row]  });
    },
};
