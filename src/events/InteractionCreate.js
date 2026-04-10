const Utils = require("../utils/index");
const Discord = require("discord.js");

module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction, client){
        if(interaction.isChatInputCommand()/* && interaction.isCommand()*/) {
            const commandslash = client.slash.get(interaction.commandName.toLowerCase());
            if(!commandslash) return interaction.reply({ 
                content: `${interaction.commandName.toLowerCase()} no es un comando valido!`,
                ephemeral: true,
            });
            try {
                await commandslash.execute(interaction, client, Utils, Discord);
            } catch(err) {
                Utils.logger.error(`Error ejecutando el comando ${interaction.commandName}:` + err);
                interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            };
        } else if(interaction.isButton()){
            const commandbt = client.buttons.get(interaction.customId);
            if(!commandbt) {
                return interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            };

            try {
                return await commandbt.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un boton:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            };
        } else if (interaction.isUserContextMenuCommand()) {
            const commanduxm = client.context.get("USER " + interaction.commandName);

            try {
                return await commanduxm.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un usercontextmenu:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            const commandmxm = client.context.get("MESSAGE " + interaction.commandName);

            try {
                return await commandmxm.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un messagecontextmenu:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else if(interaction.isAutocomplete()) {
            const request = client.autocomplete.get(interaction.commandName);
            if(!request) return;

            try {
                await request.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un autocompletado:` + err);
                return Promise.reject(err);
            };
        } else if(interaction.isModalSubmit()) {
            const commandmodal = client.modals.get(interaction.customId);
            if (!commandmodal) {
                return interaction.reply({
                    content: `Ocurrio un error!`,
                    ephemeral: true,
                });
            }
            try{
                await commandmodal.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un modal:` + err);
                await interaction.reply({
                    content: `Ocurrion un error!`,
                    ephemeral: true,
                });
            }
        } else if(interaction.isStringSelectMenu()) {
            const commandssm = client.select.get(interaction.customId);
            if (!commandssm) return;

            try {
                await commandssm.execute(interaction, client, Utils, Discord);
            } catch (err) {
                Utils.logger.error("Error en select menu: " + err);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                    content: "Ocurrió un error",
                    ephemeral: true
                    });
                }
            }
        }
    },
};
