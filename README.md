# Discord-Handler
El handler de SystemTheCow pero con aliases, interaction, anti-crash y event handler. El mejor handler para iniciar a programar un bot de discord!

Primero tienes que hacer en el terminal ``npm i discord.js@13.6.0 fs``
Luego tienes que poner tu token en [botconfig.json](./src/public/botconfig.json)

Aqui tienes la base para todos los comandos que quieras hacer:

```js
module.exports = {
    name: '', //El nombre del comando ---- Obligatorio
    aliases: [], //El alias es obligatorio que este en todos los comandos, si no se va a usar se sacan las " ---- Obligatorio
    category: '', //La categoria del comando ---- Opcional
    description: '', //La descripcion del comando ---- Opcional
    usage: '', //Como se usa el comando: Syntax: <> = required, [] = optional ---- Opcional
    userPerms: [""], //Defines los permisos necesarios del usuario ---- Opcional
    clientPerms: [""], //Defines los permisos necesarios del bot ---- Opcional
    toggleOff: false, //Defines si el comando esta deshabilitado o no, default false ---- Optional
    async execute(message, args, MessageEmbed, Util, client){
    },
};
```

Aquí la base para todos tus comandos en slash:
```js
module.exports = {
    name: '', //El nombre del comando ---- Obligatorio
    description: '', //La descripción del comando ---- Obligatorio
    options: [ //Un array con todas las opciones ---- Opcional
      {
        name: "", //El nombre de la opción ---- Obligatorio
        type: "STRING", //El tipo de opción: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type ---- Obligatorio
        description: "", //Descripción de la opción ---- Obligatorio
        required: false, //Requerido, Boolean ---- Obligatorio
      },
    ],
    async execute (Discord, client, interaction) {
    },
};
```

Para finalizar haz tus comandos y disfruta del handler! <3

# Soporte
Mi user: Matt.7w7#2112

# Repositorio original
Repositorio Base:
https://github.com/SystemTheCow/discord-js-v13/tree/Command-y-Event-Handler

Repositorio de handler slash:
https://github.com/ShingSemicolon/Guia-Slash-Command
