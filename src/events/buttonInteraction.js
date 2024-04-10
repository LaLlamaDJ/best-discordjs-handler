const { Events, Discord } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client){
        if (!interaction.isButton()) return;
        const command = client.buttons.get(interaction.customId);
        if(!command) {
            return interaction.reply({
                content: "Ocurrio un error!",
                ephemeral: true,
            });
        }

        try {
            return await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Ocurrio un error!",
                ephemeral: true,
            });
        }
    },
};
