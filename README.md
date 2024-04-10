# Discord-Handler
Una combinacion del handler de System32 y NamVr. El mejor handler para iniciar tu bot!

Primero tienes que hacer en el terminal ``npm i discord.js@lastest fs``
Luego tienes que poner tu token en [botconfig.json](./src/public/botconfig.json)

Aqui tienes la base para todos los comandos que quieras hacer:

```js
module.exports = {
    name: String, //El nombre del comando ---- Obligatorio
    aliases: [String], //El alias es obligatorio que este en todos los comandos, si no se va a usar se sacan las " ---- Obligatorio
    category: String, //La categoria del comando ---- Opcional
    description: String, //La descripcion del comando ---- Opcional
    usage: String, //Como se usa el comando: Syntax: <> = required, [] = optional ---- Opcional
    userPerms: [String], //Defines los permisos necesarios del usuario ---- Opcional
    toggleOff: Boolean, //Defines si el comando esta deshabilitado o no, default false ---- Optional
    ownerOnly: Boolean, //Defines si el comando solo lo puede ejecutar el desarollador ---- Opcional
    cooldown: Number,  //Defines el tiempo de espera para volver a ejecutarlo en segundos ---- Opcional
    async execute(message, args, Discord, Util, client){
    },
};
```

Para finalizar haz tus comandos y disfruta del handler! <3

# Soporte
Mi user: matt.7w7

# Repositorio original
Repositorios Base:
https://github.com/SystemTheCow/discord-js-v13/tree/Command-y-Event-Handler
https://github.com/NamVr/DiscordBot-Template/

Repositorio de handler slash:
https://github.com/ShingSemicolon/Guia-Slash-Command
