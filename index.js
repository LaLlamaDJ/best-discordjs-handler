const { Client, Partials, Collection, MessageEmbed, Util } = require("discord.js");
const Discord = require("discord.js")
const fs = require("fs");
const client = new Client({
  intents: 3276799,
  partials: [Partials.Channel],
  presence: {
    status: "dnd",
    activities: [
      {
      name: "Some games...",
      type: "PLAYING"
    }
  ]
  }
});

const { token } = require(`${__dirname}/src/public/botconfig.json`);

const { autocomplete } = require(`${__dirname}/src/utils/handler/autocomplete.js`);
const { buttons } = require(`${__dirname}/src/utils/handler/buttons.js`);
const { comandos } = require(`${__dirname}/src/utils/handler/comandos.js`);
const { context } = require(`${__dirname}/src/utils/handler/context.js`);
const { eventos } = require(`${__dirname}/src/utils/handler/eventos.js`);
const { modals } = require(`${__dirname}/src/utils/handler/modals.js`);
const { select } = require(`${__dirname}/src/utils/handler/selectmenu.js`);
const { slash } = require(`${__dirname}/src/utils/handler/slash.js`);
const { triggers } = require(`${__dirname}/src/utils/handler/triggers.js`);

client.cooldowns = new Collection();

autocomplete(fs, client, Collection, Discord)
buttons(fs, client, Collection, Discord)
comandos(fs, client, Collection)
context(fs, client, Collection, Discord)
eventos(fs, client, Discord, Util)
modals(fs, client, Collection, Discord)
select(fs, client, Collection, Discord)
slash(fs, client, Collection, Discord)
triggers(fs, client, Collection, Discord)

////////////----Anti Crash----////////////
process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});
////////////----Anti Crash----////////////

client.login(token);