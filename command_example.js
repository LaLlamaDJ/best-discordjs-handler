module.exports = {
    name: String, // Nombre del comando (obligatorio)
    aliases: [String], // Alias del comando 

    description: String, // Descripción del comando
    usage: String, // Ej: !ban <user> [reason]

    args: Boolean, // Si requiere argumentos
    minArgs: Number, // Mínimo de argumentos
    maxArgs: Number, // Máximo de argumentos

    argsSchema: [
        {
            name: String,       // Nombre del argumento
            type: String,       // string | number | boolean | user | member | role | channel | emoji
            required: Boolean,  // Si es obligatorio

            // SOLO PARA STRING
            rest: Boolean,      // Captura todo el resto del mensaje

            // SOLO PARA NUMBER
            min: Number,        // Valor mínimo
            max: Number,        // Valor máximo

            // TODOS
            choices: [String]   // Valores permitidos
        }
    ],

    userPerms: [String], // Permisos del usuario
    botPerms: [String], // Permisos del bot

    ownerOnly: Boolean, // Solo el owner
    guildOnly: Boolean, // Solo servidores
    nsfw: Boolean, // Solo canales NSFW
    cooldown: Number, // Cooldown en segundos
    toggleOff: Boolean, // Deshabilitado

    async execute(ctx, args, parsedArgs, client, Utils, Discord) {
    },
};