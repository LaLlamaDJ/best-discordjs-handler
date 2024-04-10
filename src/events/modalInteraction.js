const { Events, Discord } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    once: true,
    async execute(interaction, client){
        if(!interaction.isModalSubmit()) return;
        const command = client.modals.get(interaction.customId);
        if (!command) {
            return interaction.reply({
                content: `Ocurrio un error!`,
                ephemeral: true,
            });
        }
        
        try{
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: `Ocurrion un error!`,
                ephemeral: true,
            });
        }
    },
};
