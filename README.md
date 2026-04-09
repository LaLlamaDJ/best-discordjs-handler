# Discord-Handler
Un handler para iniciar en el armado de bots de discord. Cuenta con comandos de prefix, comandos slash, menues contextuales, botones y modales.

Esta armado para usar la menor cantidad de modulos npm posibles, se le integra a todo el sistema desde [index.js](./src/utils/index.js) un logger customizado para mejorar la lectura en consola ademas incluye un sistema anti crasheo para evitar que deje de funcionar todo el bot por un error especifico, un reemplazo a "axios" para interactuar con APIS, otro formato de armado de embeds (sera detallado proximamente) para ajustar automaticamente el footer, avatar y color de cada uno y por ultimo un "modulo" para pedir gifs de monas chinas para el que quiera incluir reacciones y todo eso. El mejor handler para iniciar a programar un bot de discord!

El primer paso es ingresar en el terminal ``npm i discord.js fs pm2`` luego completar [botconfig.json](./src/public/botconfig.json) con los datos necesarios.
Aclaracion: pm2 se puede obviar, solo se usa para el comando restart.

Aqui tienes la base para todos los comandos que quieras hacer:

```js
module.exports = {
    name: '', //El nombre del comando ---- Obligatorio
    aliases: [], //El alias es obligatorio que este en todos los comandos
    async execute(message, args, MessageEmbed, Util, client){
    },
};
```

Aquí la base para todos tus comandos en slash:
```js
module.exports = {
  data: {
    name: "", //El nombre del comando ---- Obligatorio
    description: "", // La descripcion del comando ---- Obligatorio
  },
  async execute(interaction, client, Utils, Discord) {
  }
};
```

Aqui la formacion de nuevos embeds:
```js
//Basicamente se reemplaza EmbedBuilder por Utils.embed() y se arma todo en formato json, importante no poner footer, timestamp ni color!!!!
const embed = new Utils.embed(author, {//Obligatorio el author
  "title":"",
  "description":"",
  "image":{
    "url":"..."
  }
  });
```

Para finalizar haz tus comandos y disfruta del handler con un ``node . ``! <3

# Soporte
Mi user: matt.7w7
