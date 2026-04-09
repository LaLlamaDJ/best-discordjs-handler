const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { Events } = require("discord.js");
const Utils = require("../utils/index");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        const rest = new REST({ version: "9" }).setToken(Utils.config.token);
        const commandJsonData = [
            ...Array.from(client.slash.values()).map((c) => c.data),
            ...Array.from(client.context.values()).map((c) => c.data),
        ];

        if(Utils.config.slash_global === "true") {
            (async () =>{
                try {
                    await rest.put(
                        Routes.applicationCommands(Utils.config.client_id),
                        { body: commandJsonData }
                    );
                    Utils.logger.success("Slash commands cargados correctamente.");
                } catch (error) {
                    Utils.logger.error(error);
                }
            })();
        } else {
            (async () =>{
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(Utils.config.client_id, Utils.config.test_guild_id),
                    { body: commandJsonData }
                );
                Utils.logger.success("Slash commands cargados correctamente.");
                } catch (error) {
                    Utils.logger.error(error);
                }
            })();
        }
        Utils.logger.success(`Iniciado como ${client.user.username}`);
    },
};
