module.exports = {
    id: "help-menu",
    async execute(interaction, client, Utils, Discord) {
        const categoryEmojis = {
            utilidades: "🛠️",
            admin: "⚙️",
            general: "📌",
            acciones: "🎭",
            musica: "🎵"
        };
        const categories = {};

        client.commands.forEach(cmd => {
            const cat = cmd.category || "Sin categoria";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        });

        const selected = interaction.values[0];
        const cmds = categories[selected];

        const descripcion = cmds
            .map(cmd => `**${cmd.name}** - ${cmd.description || "Sin descripción"}`)
            .join("\n");

        const key = selected.toLowerCase();
        const emoji = categoryEmojis[key] || "📁";

        const embed = Utils.embed(interaction.user, {
            "title": `${emoji} ${selected.charAt(0).toUpperCase() + selected.slice(1).toLowerCase()}`,
            "description": descripcion || "No hay comandos en esta categoría"
        });

        await interaction.update({
            embeds: [embed],
            components: interaction.message.components
        });
    }
};