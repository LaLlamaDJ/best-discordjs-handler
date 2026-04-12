module.exports = {
    name: 'cuddle',
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        let author = message.author
        let user = message.mentions.users.first()

        if(!user) {
            return message.reply(`Debes mencionar a alguien!`);
        }

        const embed = Utils.embed(author, {
            "description": `**${author.displayName}** se acurrucó con **${user.displayName}**!`,
            "image": {
                "url": `${await Utils.dgif.cuddle()}`
            }
        })
        message.channel.send({ embeds: [embed] })
        },
    };