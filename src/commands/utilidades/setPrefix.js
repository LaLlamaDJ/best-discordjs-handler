module.exports = {
    name: "setprefix",
    description: "Cambia el prefix del servidor",
    usage: "<nuevo_prefix>",
    guildOnly: true,
    userPerms: ["Administrator"],
    botPerms: [],
    cooldown: 15,
    args: true,
    minArgs: 1,
    maxArgs: 1,
    argsSchema: [
        { name: "prefix", type: "string", required: true }
    ],
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        const newPrefix = parsedArgs.prefix;
        if (newPrefix.length > 5) {
            return message.reply("❌ El prefix no puede tener más de 5 caracteres.");
        }

        await Utils.db.guild.setPrefix(message.guild.id, newPrefix);

        const embed = Utils.embed(message.author, {
            title: "Prefix actualizado",
            description: `✔ Nuevo prefix: \`${newPrefix}\``
        });
        
        return message.reply({ embeds: [embed] });
    }
};