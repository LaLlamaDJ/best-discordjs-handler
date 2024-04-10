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
