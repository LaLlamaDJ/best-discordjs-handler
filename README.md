# ⚡ El mejor handler de Discord.js
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge&logo=discord)
![MongoDB](https://img.shields.io/badge/MongoDB-enabled-green?style=for-the-badge&logo=mongodb)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)
![last commit](https://img.shields.io/github/last-commit/LaLlamaDJ/best-discordjs-handler?style=for-the-badge)
![npm](https://img.shields.io/npm/v/discord.js?style=for-the-badge)
Un handler modular para bots de Discord.js pensado para ser liviano, escalable y fácil de entender.

Incluye sistema de comandos prefix, slash commands, context menus, botones y modales.

Además integra MongoDB con sistema de prefix por servidor, logger personalizado, fetch utilitario, provider de GIFs y herramientas para acelerar el desarrollo.

---

## 🚨 Importante

Existe una segunda rama del repositorio llamada **FUSION**, la cual unifica la creación de comandos para que sean compatibles tanto con prefix como con slash commands.

---

## ✨ Features

- ⚙️ Comandos prefix
- 💬 Slash commands
- 📌 Context menus
- 🔘 Botones y modales
- 🗄️ MongoDB integrado (Mongoose)
- ⚙️ Prefix dinámico por servidor
- 🪵 Logger personalizado
- 🌐 Fetch wrapper (reemplazo de axios)
- 🎞️ GIF provider modular
- 🧠 Sistema anti-crash
- 📦 Arquitectura ligera y modular

---

## 📦 Instalación

```bash
npm install discord.js fs mongoose pm2
```

> ⚠️ PM2 es opcional (solo para auto-restart del bot)

---

## ⚙️ Configuración

Completar el archivo:

```id="config"
src/public/botconfig.json
```

con tus datos de bot y MongoDB.

---

## 🚀 Inicio

```bash
node .
```

---

## 📁 Estructura base

```
/src
  /commands
  /events
  /interactions
  /models
  /public
    botconfig.json
  /slash
  /triggers
  /utils
    /database
    /handler
    /others
      defaultEmbed.js
      fetch.js
      gifsProvider.js
      logger.js
    database.js
    index.js
app.log
index.js
```

---

## 🧠 Base de comandos (prefix)

```js
module.exports = {
    name: String,
    aliases: [String],

    description: String,
    usage: String,

    args: Boolean,
    minArgs: Number,
    maxArgs: Number,

    argsSchema: [
        {
            name: String,
            type: String, // string | number | boolean | user | member | role | channel | emoji
            required: Boolean,

            rest: Boolean, // solo string

            min: Number,   // solo number
            max: Number,   // solo number

            choices: [String]
        }
    ],

    userPerms: [String],
    botPerms: [String],

    ownerOnly: Boolean,
    guildOnly: Boolean,
    nsfw: Boolean,
    cooldown: Number,
    toggleOff: Boolean,

    async execute(message, args, parsedArgs, client, Utils, Discord) {}
};
```

---

## 💬 Base de comandos (slash)

```js
module.exports = {
  data: {
    name: "",
    description: "",
  },

  async execute(interaction, client, Utils, Discord) {}
};
```

---

## 🧩 Sistema de embeds

Se reemplaza `EmbedBuilder` por el sistema de Utils:

```js
const embed = new Utils.embed(author, {
  title: "",
  description: "",
  image: {
    url: ""
  }
});
```

> ⚠️ No agregar footer, timestamp ni color manualmente (el sistema lo maneja automáticamente)

---

## 🗄️ Base de datos

Integrado con MongoDB usando Mongoose para:

* Prefix por servidor
* Configuración de guilds
* Escalabilidad futura

---

## 🪵 Logger

Sistema de logs mejorado para consola:

```js
Utils.logger.success("Conectado");
Utils.logger.error("Error detectado");
Utils.logger.fatal("Error fatal");
Utils.logger.debug("Info debug");
Utils.logger.warn("Alerta peligro");
Utils.logger.info("Existen 5 comandos de prefix");
```

---

## 🌐 Fetch system

Reemplazo liviano de axios:

```js
const data = await Utils.fetch("https://api.example.com");
```

---

## 🎞️ GIF Provider

Sistema modular para obtener GIFs:

```js
const gif = await Utils.gif.get("hug");
```

---

## ⚡ Anti-crash system

El handler incluye protección contra errores críticos para evitar que el bot se caiga por fallos en comandos o eventos.

---

## 🧠 Notas

Este proyecto está diseñado para:

* Aprender a crear bots de Discord
* Servir como base para proyectos grandes
* Ser liviano y modificable fácilmente

---

## ❤️ Final

Haz tus comandos y disfruta del handler con:

```bash
node .
```

---

## 🛠️ Soporte

Mi usuario: **matt.7w7**