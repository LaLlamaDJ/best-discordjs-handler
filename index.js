const Discord = require("discord.js")
const fs = require("fs");
const Utils = require("./src/utils/index");
const client = new Discord.Client({
  intents: 3276799,
  partials: [Discord.Partials.Channel],
  presence: { status: "dnd", activities: [{ name: "Some games...", type: "PLAYING" }] }
});

const args3 = [fs, client, Discord], args2 = [fs, client];
const handlers = { autocomplete: args3, buttons: args3, comandos: args3, context: args3, eventos: args2, modals: args3, selectmenu: args3, slash: args3, triggers: args3 };

Object.entries(handlers).forEach(([name, args]) => {
  const handler = require(`${__dirname}/src/utils/handler/${name}.js`);
  handler[name === 'selectmenu' ? 'select' : name]?.(...args);
});

Utils.logger.initGlobalHandlers();
client.login(Utils.config.token).catch(err => Utils.logger.fatal("Error al iniciar sesión: " + err));