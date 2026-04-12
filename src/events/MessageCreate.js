const Utils = require("../utils/index");
const Discord = require("discord.js");

module.exports = {
    name: Discord.Events.MessageCreate,
    execute(message, client){
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (!message.content.startsWith(Utils.config.prefix) || message.author.bot) return;
        const args = message.content.slice(Utils.config.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName.toLowerCase()) ||  client.commands.find((command) => command.aliases && command.aliases.includes(commandName));
        if(!command) return message.reply(`${commandName} no es un comando valido!`);
        if(command) {
            if(command.ownerOnly && message.author.id !== Utils.config.owner) {
                return message.channel.send(`Ese comando solo mi creador lo puede usar!!`)
            }
            if(command.userPerms) {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.userPerms)) {
                    return message.channel.send(`No tienes suficientes permisos!`)
                }
            }
            if (command.toggleOff) {
                return message.channel.send(`Este comando fue deshabiltado por mi creador!!`)
            }
            
            //////////////////// COOLDOWNS ////////////////////
            if (!client.cooldowns.has(command.name)) {
			    client.cooldowns.set(command.name, new Discord.Collection());
		    }
            const now = Date.now();
		    const timestamps = client.cooldowns.get(command.name);;
		    const cooldownAmount = (command.cooldown || 3) * 1000;
            if (timestamps.has(message.author.id)) {
			    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			    if (now < expirationTime) {
			    	const timeLeft = (expirationTime - now) / 1000;
			    	return message.channel.send(`Espera ${timeLeft.toFixed(1)} segundos para volver a usar \`${command.name}\`.`)
			    }
		    }
            timestamps.set(message.author.id, now);
    		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //////////////////// COOLDOWNS ////////////////////
        }

        //////////////////// TRIGGERS ////////////////////
        let triggered = false;
        message.client.triggers.every((trigger) => {
            if(triggered) return false;
            trigger.name.every(async (name) => {
                if(triggered) return false;
                if(message.content.includes(name)) {
                    try {
                        trigger.execute(message, args);
                    } catch (err) {
                        Utils.logger.error(`Trigger error:` + err);
                        message.reply({
                            content: "Ocurrio un error!"
                        });
                    }
                    triggered = false;
                    return false;
                }
            });
        });
        //////////////////// TRIGGERS ////////////////////

        try{
            command.execute(message, args, client, Utils, Discord)
        }catch(error){
            Utils.logger.error(`Error ejecutando el comando ${command.name}:` + error);
            message.channel.send("Ocurrio un error!")
        }
    },
};
