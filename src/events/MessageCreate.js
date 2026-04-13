const Utils = require("../utils/index");
const Discord = require("discord.js");

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
            const user = message.mentions.users.first() || client.users.cache.get(raw);
            if (!user && param.required) {
                return { error: `Usuario inválido: ${param.name}` };
            }
            parsed[param.name] = user || null;
            index++;
        } else if (param.type === "member") {
            const member = message.mentions.members.first() || message.guild.members.cache.get(raw);
            if (!member && param.required) {
                return { error: `Miembro inválido: ${param.name}` };
            }
            parsed[param.name] = member || null;
            index++;
        } else if (param.type === "role") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(raw);
            if (!role && param.required) {
                return { error: `Rol inválido: ${param.name}` };
            }
            parsed[param.name] = role || null;
            index++;
        } else if (param.type === "channel") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(raw);
            if (!channel && param.required) {
                return { error: `Canal inválido: ${param.name}` };
            }
            parsed[param.name] = channel || null;
            index++;
        } else if (param.type === "emoji") {
            const emoji = message.guild.emojis.cache.find(e => e.toString() === raw) || raw;
            if (!emoji && param.required) {
                return { error: `Emoji inválido: ${param.name}` };
            }
            parsed[param.name] = emoji || null;
            index++;
        }
        if (param.choices && parsed[param.name] !== null && parsed[param.name] !== undefined) {
            if (!param.choices.includes(parsed[param.name])) {
                return {
                    error: `${param.name} debe ser uno de: ${param.choices.join(", ")}`
                };
            }
        }
    }
    return { parsed };
}

function createContext(ctx) {
    const isSlash = ctx.isChatInputCommand?.();
    return {
        raw: ctx,
        isSlash,
        reply: (content) => {
            if (isSlash) {
                return ctx.reply(content);
            } else {
                return ctx.reply(content);
            }
        },
        send: (content) => {
            if (isSlash) {
                return ctx.channel.send(content);
            } else {
                return ctx.channel.send(content);
            }
        },
        user: isSlash ? ctx.user : ctx.author,
        member: isSlash ? ctx.member : ctx.member,
        guild: ctx.guild,
        channel: ctx.channel
    };
}

module.exports = {
    name: Discord.Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(Utils.config.prefix)) return;

        const args = message.content.slice(Utils.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command =
            client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases?.includes(commandName));

        if (!command) {
            return message.reply(`${commandName} no es un comando valido!`);
        }
        let parsedArgs = null;

        if (command.ownerOnly && message.author.id !== Utils.config.owner) {
            return message.reply("Ese comando solo mi creador lo puede usar!!");
        }
        if (command.toggleOff) {
            return message.reply("Este comando fue deshabilitado!");
        }
        if (command.guildOnly && !message.guild) {
            return message.reply("Solo en servidores.");
        }
        if (command.nsfw && !message.channel.nsfw) {
            return message.reply("Solo en canales NSFW.");
        }
        if (command.args && !args.length) {
            return message.reply(`Faltan argumentos.\nUso: ${command.usage || "No especificado"}`);
        }
        if (command.minArgs && args.length < command.minArgs) {
            return message.reply(`Mínimo ${command.minArgs} argumentos.`);
        }
        if (command.maxArgs && args.length > command.maxArgs) {
            return message.reply(`Máximo ${command.maxArgs} argumentos.`);
        }
        if (command.userPerms?.length) {
            const missing = command.userPerms.filter(p => !message.member.permissions.has(p));
            if (missing.length) {
                return message.reply(`No tenés permisos: ${missing.join(", ")}`);
            }
        }
        if (command.botPerms?.length) {
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

        if (!client.cooldowns) client.cooldowns = new Map();
        const scope = command.cooldownScope || "user";

        let key;
        if (scope === "user") key = `${command.name}_${message.author.id}`;
        else if (scope === "guild") key = `${command.name}_${message.guild.id}`;
        else key = command.name;
        const now = Date.now();
        const cooldown = (command.cooldown || 3) * 1000;

        if (client.cooldowns.has(key)) {
            const expire = client.cooldowns.get(key);
            if (now < expire) {
                const left = ((expire - now) / 1000).toFixed(1);
                return message.reply(`Esperá ${left}s`);
            }
        }
        client.cooldowns.set(key, now + cooldown);
        setTimeout(() => client.cooldowns.delete(key), cooldown);

        try {
            const ctx = createContext(message);
            await command.execute(ctx, args, parsedArgs, client, Utils, Discord);
        } catch (err) {
            Utils.logger.error(`Error en ${command.name}: ${err}`);
            message.reply("Ocurrió un error!");
        }
    }
};