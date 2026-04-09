const { Events, Discord } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client){
        if (!interaction.isContextMenuCommand()) return;
        if (interaction.isUserContextMenuCommand()) {
            const command = client.context.get("USER " + interaction.commandName);

            try {
                return await command.execute(interaction);
            } catch (err) {
                console.error(err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            const command = client.context.get("MESSAGE " + interaction.commandName);

            try {
                return await command.execute(interaction);
            } catch (err) {
                console.error(err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else {
            return console.log("Ocurrio un error con un context menu.");
        }
    },
};
