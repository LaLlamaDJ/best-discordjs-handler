module.exports = {
    name: "help",
    aliases: [], 
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        const query = args[0]?.toLowerCase();
        const categoryEmojis = {
            utilidades: "🛠️",
            admin: "⚙️",
            general: "📌",
            acciones: "🎭",
            musica: "🎵"
        };
        const categories = {};
        const command =
            client.commands.get(query) ||
            client.commands.get(client.aliases.get(query));

        client.commands.forEach(cmd => {
            const cat = cmd.category || "Sin Categorizar";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        });

        if(!query) {
            const embed = Utils.embed(message.author, {
                "title": "📖 Panel de Ayuda",
                "description": "Seleccioná una categoría del menú"
            });

            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("Elegí una categoría")
                .addOptions(
                    Object.keys(categories).map(cat => {
                        const catKey = cat.toLowerCase();
                        return {
                            label: `${categoryEmojis[catKey] || "📁"} ${cat}`,
                            value: cat
                        };
                    })
                );

            const row = new Discord.ActionRowBuilder().addComponents(menu);

            await message.reply({
                embeds: [embed],
                components: [row]
            });
        } else if (query && command) {
            const usage = command.usage
            ? `${Utils.config.prefix}${command.name} ${command.usage}`
            : `${Utils.config.prefix}${command.name}`;
            const embedCMD = Utils.embed(message.author, {
                title: `📌 Comando: ${command.name}`,
                description: command.description || "Sin descripción",
                fields: [
                    {
                        name: "🧩 Categoría",
                        value: command.category || "Sin categoría",
                        inline: true
                    },
                    {
                        name: "🔁 Aliases",
                        value: command.aliases?.length
                        ? command.aliases.join(", ")
                        : "Ninguno",
                        inline: true
                    },
                    {
                        name: "📥 Uso",
                        value: `\`${usage}\``
                    }
                ]
            });
            return message.reply({ embeds: [embedCMD] });
        } if (query && !command) {
            return message.reply({
                content: "❌ Ese comando no existe",
                ephemeral: true
            });
        }
    },
};
