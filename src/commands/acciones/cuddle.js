module.exports = {
    name: 'cuddle',
    description: 'Acurrúcate con alguien',
    usage: "<usuario>",
    cooldown: 7,
    args: true,
    minArgs: 1,
    maxArgs: 1,
    argsSchema: [
        { name: "user", type: "user", required: true }
    ],
    async execute(ctx, args, parsedArgs, client, Utils, Discord) {
        const embed = Utils.embed(ctx.user, {
            "description": `**${ctx.user.displayName}** se acurrucó con **${parsedArgs.user.displayName}**!`,
            "image": {
                "url": `${await Utils.dgif.cuddle()}`
            }
        })
        ctx.reply({ embeds: [embed] })
        },
    };