const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { Events } = require("discord.js");
const { token, client_id, test_guild_id } = require("../public/botconfig.json")

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        const rest = new REST({ version: "9" }).setToken(token);
        const commandJsonData = [
            ...Array.from(client.slash.values()).map((c) => c.data),
            ...Array.from(client.context.values()).map((c) => c.data),
        ];

        (async () =>{
            try {
                await rest.put(
                    Routes.applicationGuildCommands(client_id, test_guild_id),
                    // Routes.applicationsCommands(client_id)
                    { body: commandJsonData }
                );
                console.log("Slash commands cargados correctamente.");
            } catch (error) {
                console.log(error);
            }
        })();

        /*try {
            client.application.commands.set(client.array)
        } catch(error) {
            console.log(error)
        }*/

        console.log(`[INFO] Iniciado como ${client.user.username}`);
    },
};
