const Utils = require("../utils/index");
const Discord = require("discord.js");

module.exports = {
    name: Discord.Events.MessageCreate,
    async execute(message, client){
        if (message.author.bot) return;
        if (!message.guild) return;
        const guildDB = await Utils.db.guild.getGuild(message.guild.id);
        const prefix = guildDB.prefix || Utils.config.prefix;
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName.toLowerCase()) ||  client.commands.find((command) => command.aliases && command.aliases.includes(commandName));
        if(!command) return message.reply(`${commandName} no es un comando valido!`);

        let parsedArgs = null;

        function parseArgs(message, args, schema, client) {
                const parsed = {};
                let index = 0;
                for (const param of schema) {
                    let raw = args[index];
                    if (param.type === "string") {
                        if (param.rest) {
                            const value = args.slice(index).join(" ");
                            if (param.required && !value) {
                                return { error: `Falta: ${param.name}` };
                            }
                            parsed[param.name] = value || null;
                            break;
                        } else {
                            if (param.required && !raw) {
                                return { error: `Falta: ${param.name}` };
                            }
                            parsed[param.name] = raw || null;
                            index++;
                        }
                    } else if (param.type === "number") {
                        const num = Number(raw);
                        if ((isNaN(num) || raw === undefined) && param.required) {
                            return { error: `Número inválido en: ${param.name}` };
                        }
                        if (param.min !== undefined && num < param.min) {
                            return { error: `${param.name} debe ser >= ${param.min}` };
                        }
                        if (param.max !== undefined && num > param.max) {
                            return { error: `${param.name} debe ser <= ${param.max}` };
                        }
                        parsed[param.name] = isNaN(num) ? null : num;
                        index++;
                    } else if (param.type === "boolean") {
                        if (!raw && param.required) {
                            return { error: `Falta: ${param.name}` };
                        }
                        const truthy = ["true", "yes", "1", "on"];
                        const falsy = ["false", "no", "0", "off"];
                        if (truthy.includes(raw)) parsed[param.name] = true;
                        else if (falsy.includes(raw)) parsed[param.name] = false;
                        else if (param.required) return { error: `Boolean inválido en: ${param.name}` };
                        else parsed[param.name] = null;
                        index++;
                    } else if (param.type === "user") {
                        let user =
                            message.mentions.users.first() ||
                            client.users.cache.get(raw);
                        if (!user && param.required) {
                            return { error: `Usuario inválido: ${param.name}` };
                        }
                        parsed[param.name] = user || null;
                        index++;
                    } else if (param.type === "member") {
                        let member =
                            message.mentions.members.first() ||
                            message.guild?.members.cache.get(raw);
                        if (!member && param.required) {
                            return { error: `Miembro inválido: ${param.name}` };
                        }
                        parsed[param.name] = member || null;
                        index++;
                    } else if (param.type === "role") {
                        let role =
                            message.mentions.roles.first() ||
                            message.guild?.roles.cache.get(raw);
                        if (!role && param.required) {
                            return { error: `Rol inválido: ${param.name}` };
                        }
                        parsed[param.name] = role || null;
                        index++;
                    } else if (param.type === "channel") {
                        let channel =
                            message.mentions.channels.first() ||
                            message.guild?.channels.cache.get(raw);
                        if (!channel && param.required) {
                            return { error: `Canal inválido: ${param.name}` };
                        }
                        parsed[param.name] = channel || null;
                        index++;
                    } else if (param.type === "emoji") {
                        let emoji =
                            message.guild?.emojis.cache.find(e => e.toString() === raw) ||
                            raw;
                        if (!emoji && param.required) {
                            return { error: `Emoji inválido: ${param.name}` };
                        }
                        parsed[param.name] = emoji || null;
                        index++;
                    } if (param.choices && parsed[param.name] !== null && parsed[param.name] !== undefined) {
                        if (!param.choices.includes(parsed[param.name])) {
                            return {
                                error: `${param.name} debe ser uno de: ${param.choices.join(", ")}`
                            };
                        }
                    }
                }
                return { parsed };
        }

        if(command) {
            if(command.ownerOnly && message.author.id !== Utils.config.owner) {
                return message.reply(`Ese comando solo mi creador lo puede usar!!`)
            }
            if (command.toggleOff) {
                return message.reply(`Este comando fue deshabiltado por mi creador!!`)
            }
            if (command.guildOnly && !message.guild) {
                return message.reply("Este comando solo se puede usar en servidores.");
            }
            if (command.nsfw && !message.channel.nsfw) {
                return message.reply("Este comando solo se puede usar en canales NSFW.");
            }
            if (command.args && !args.length) {
                return message.reply(`Faltan argumentos.\nUso: ${command.usage || "No especificado"}`);
            }
            if (command.minArgs && args.length < command.minArgs) {
                return message.reply(`Necesitás al menos ${command.minArgs} argumentos.`);
            }
            if (command.maxArgs && args.length > command.maxArgs) {
                return message.reply(`Máximo ${command.maxArgs} argumentos permitidos.`);
            }
            if (command.userPerms && command.userPerms.length) {
                const missing = command.userPerms.filter(p => !message.member.permissions.has(p));
                if (missing.length) {
                    return message.reply(`No tenés permisos: ${missing.join(", ")}`);
                }
            }
            if (command.botPerms && command.botPerms.length) {
                const missing = command.botPerms.filter(p => !message.guild.members.me.permissions.has(p));
                if (missing.length) {
                    return message.reply(`Me faltan permisos: ${missing.join(", ")}`);
                }
            }
            if (command.argsSchema) {
                const result = parseArgs(message, args, command.argsSchema, client);
                if (result.error) {
                    return message.reply(result.error);
                }
                parsedArgs = result.parsed;
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
            command.execute(message, args, parsedArgs, client, Utils, Discord)
        }catch(error){
            Utils.logger.error(`Error ejecutando el comando ${command.name}:` + error);
            message.channel.send("Ocurrio un error!")
        }
    },
};
