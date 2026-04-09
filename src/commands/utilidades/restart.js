module.exports = {
    name: `restart`, //El nombre del comando ---- Obligatorio
    aliases: [`rest`], //El alias es obligatorio que este en todos los comandos, si no se va a usar se sacan las " ---- Obligatorio
    ownerOnly: true, //Defines si el comando solo lo puede ejecutar el desarollador ---- Opcional
    async execute(message, args, client, Utils, Discord){
        message.reply({ content: `Reiniciando el bot...` })
        setTimeout(() => { //Añade un timeout
            process.exit(); //Esta función es como un CTRL + C, pero cuando PM2 detecta que se cierra la aplicación, procede a volver a iniciarla.
        }, 2500);
    },
};
