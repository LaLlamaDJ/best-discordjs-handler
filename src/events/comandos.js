const { prefix, owner } = require("../public/botconfig.json")
const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    execute(message, client, Discord, Util){
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
   
        const command = client.commands.get(commandName.toLowerCase()) ||  client.commands.find((command) => command.aliases && command.aliases.includes(commandName));
        if(!command) return message.reply(`${commandName} no es un comando valido!`);
        if(command) {
            const { cooldowns } = client;
            const now = Date.now();
		    const timestamps = cooldowns.get(command.name);
		    const cooldownAmount = (command.cooldown || 3) * 1000;

            if(command.ownerOnly && message.author.id !== owner) {
                return message.channel.send(`Ese comando solo mi creador lo puede usar!!`)
            }
            if(command.userPerms) {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.userPerms)) {
                    return message.channel.send(`No tienes suficientes permisos!`)
                }
            }
            /*if(!message.member.permissions.has(command.userPerms || [])) {
                return message.channel.send(`No tienes el permiso \`${command.userPerms || []}\``)
            }*/
            /*if(!message.guild.me.permissions.has(command.clientPerms || [])) {
                return message.channel.send(`No tengo el permiso \`${command.clientPerms || []}\``)
            }*/
            if (command.toggleOff) {
                return message.channel.send(`Este comando fue deshabiltado por mi creador!!`)
            }
		    if (!cooldowns.has(command.name)) {
			    cooldowns.set(command.name, new Collection());
		    }
            if (timestamps.has(message.author.id)) {
			    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			    if (now < expirationTime) {
			    	const timeLeft = (expirationTime - now) / 1000;
			    	return message.channel.send(`Espera ${timeLeft.toFixed(1)} segundos para volver a usar \`${command.name}\.`);
			    }
		    }
            timestamps.set(message.author.id, now);
    		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        }

        try{
            command.execute(message, args, Discord, Util, client)
        }catch(error){
            console.error(error);
            message.channel.send("Ocurrio un error!")
        }
    },
};
