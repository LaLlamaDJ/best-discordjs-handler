module.exports = {
    name: 'help',
    description: 'Visualiza la lista de comandos.',
    usage: "[comando]",
    cooldown: 7,
    args: false,
    minArgs: 0,
    maxArgs: 1,
    argsSchema: [
        { name: "comando", type: "string", required: false }
    ],

    async execute(ctx, args, parsedArgs, client, Utils, Discord) {

        const query = parsedArgs.comando?.toLowerCase();

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

        // ================= SIN ARGUMENTOS =================
        if (!query) {

            const embed = Utils.embed(ctx.user, {
                title: "📖 Panel de Ayuda",
                description: "Seleccioná una categoría del menú"
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

            return ctx.reply({
                embeds: [embed],
                components: [row]
            });
        }

        // ================= COMANDO ESPECÍFICO =================
        if (query && command) {

            const usage = command.usage
                ? `${Utils.config.prefix}${command.name} ${command.usage}`
                : `${Utils.config.prefix}${command.name}`;

            const embedCMD = Utils.embed(ctx.user, {
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
                        value: `\`${usage}\``,
                        inline: true
                    },
                    {
                        name: "⏱️ Enfriamiento",
                        value: command.cooldown
                            ? `${command.cooldown} segundos`
                            : "No tiene",
                        inline: true
                    },
                    {
                        name: "🔞 NSFW",
                        value: command.nsfw ? "Sí" : "No",
                        inline: true
                    },
                    {
                        name: "👑 Permisos del usuario",
                        value: command.userPerms?.length
                            ? command.userPerms.join(", ")
                            : "Ninguno",
                        inline: true
                    },
                    {
                        name: "👮 Permisos del bot",
                        value: command.botPerms?.length
                            ? command.botPerms.join(", ")
                            : "Ninguno"
                    }
                ]
            });

            return ctx.reply({ embeds: [embedCMD] });
        }

        // ================= NO EXISTE =================
        if (query && !command) {
            return ctx.reply("❌ Ese comando no existe");
        }
    },
};