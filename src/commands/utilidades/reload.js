const commandHandler = require("../../utils/handler/comandos")
const eventHandler = require("../../utils/handler/eventos")
const slashHandler = require("../../utils/handler/slashCommands")
const fs = require("fs");

module.exports = {
    name: `reload`, 
    aliases: [`rl`], 
    ownerOnly: true, 
    description: 'Recarga distitnas cosas del bot.',
    usage: "", 
    cooldown: 10, 
    args: false,
    minArgs: 0,
    maxArgs: 1,
    argsSchema: [
        { name: "tipo", type: "string", required: false, choices: ["comandos", "eventos", "slash"] }
    ],
    async execute(message, args, parsedArgs, client, Utils, Discord) {
        if (parsedArgs.tipo === "comandos") {
            commandHandler.comandos(fs, client, Discord);
            Utils.logger.warn(`Comandos recargados por ${message.author.tag}`);
            message.reply({ content: `Comandos recargados.` });
        } else if (parsedArgs.tipo === "eventos") {
            eventHandler.eventos(fs, client);
            Utils.logger.warn(`Eventos recargados por ${message.author.tag}`);
            message.reply({ content: `Eventos recargados.` });
        } else if (parsedArgs.tipo === "slash") {
            slashHandler.slash(fs, client, Discord);
            Utils.logger.warn(`Comandos slash recargados por ${message.author.tag}`);
            message.reply({ content: `Comandos slash recargados.` });
        } else {
            commandHandler.comandos(fs, client, Discord);
            slashHandler.slash(fs, client, Discord);
            eventHandler.eventos(fs, client);
            Utils.logger.warn(`Comandos de prefix, slash y eventos recargados por ${message.author.tag}`);
            message.reply({ content: `Comandos de prefix, slash y eventos recargados.` });
        }
    },
};
