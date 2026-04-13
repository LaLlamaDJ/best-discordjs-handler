const Utils = require("../utils/index");
const Discord = require("discord.js");

module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction, client){
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: `${interaction.commandName} no es un comando valido!`,
                    ephemeral: true,
                });
            }
            let parsedArgs = {};
            if (command.argsSchema) {
                for (const arg of command.argsSchema) {
                    const value = interaction.options.get(arg.name);
                    if (!value) {
                        if (arg.required) {
                            return interaction.reply({
                                content: `Falta: ${arg.name}`,
                                ephemeral: true,
                            });
                        }
                        parsedArgs[arg.name] = null;
                        continue;
                    }
                    switch (arg.type) {
                        case "string":
                        case "number":
                        case "boolean":
                            parsedArgs[arg.name] = value.value;
                            break;
                        case "user":
                        case "member":
                            parsedArgs[arg.name] = value.user;
                            break;
                        case "channel":
                            parsedArgs[arg.name] = value.channel;
                            break;
                        case "role":
                            parsedArgs[arg.name] = value.role;
                            break;
                        default:
                            parsedArgs[arg.name] = value.value;
                    }
                    if (arg.choices && !arg.choices.includes(parsedArgs[arg.name])) {
                        return interaction.reply({
                            content: `${arg.name} debe ser uno de: ${arg.choices.join(", ")}`,
                            ephemeral: true,
                        });
                    }
                }
            }
            if (command.ownerOnly && interaction.user.id !== Utils.config.owner) {
                return interaction.reply({ content: "Solo el developer puede usar esto.", ephemeral: true });
            }
            if (command.toggleOff) {
                return interaction.reply({ content: "Este comando está deshabilitado.", ephemeral: true });
            }
            if (command.userPerms?.length) {
                const missing = command.userPerms.filter(p => !interaction.member.permissions.has(p));
                if (missing.length) {
                    return interaction.reply({
                        content: `No tenés permisos: ${missing.join(", ")}`,
                        ephemeral: true
                    });
                }
            }
            if (command.botPerms?.length) {
                const missing = command.botPerms.filter(p => !interaction.guild.members.me.permissions.has(p));
                if (missing.length) {
                    return interaction.reply({
                        content: `Me faltan permisos: ${missing.join(", ")}`,
                        ephemeral: true
                    });
                }
            }
            const ctx = {
                raw: interaction,
                isSlash: true,
                reply: (content) => interaction.reply(content),
                user: interaction.user,
                member: interaction.member,
                guild: interaction.guild,
                channel: interaction.channel
            };
            try {
                await command.execute(ctx, [], parsedArgs, client, Utils, Discord);
            } catch (err) {
                Utils.logger.error(`Error ejecutando el comando ${interaction.commandName}:` + err);
                if (interaction.replied || interaction.deferred) {
                    interaction.followUp({ content: "Ocurrió un error!", ephemeral: true });
                } else {
                    interaction.reply({ content: "Ocurrió un error!", ephemeral: true });
                }
            }
        }else if(interaction.isButton()){
            const commandbt = client.buttons.get(interaction.customId);
            if(!commandbt) {
                return interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            };
            try {
                return await commandbt.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un boton:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            };
        } else if (interaction.isUserContextMenuCommand()) {
            const commanduxm = client.context.get("USER " + interaction.commandName);
            try {
                return await commanduxm.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un usercontextmenu:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            const commandmxm = client.context.get("MESSAGE " + interaction.commandName);
            try {
                return await commandmxm.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un messagecontextmenu:` + err);
                await interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                });
            }
        } else if(interaction.isAutocomplete()) {
            const request = client.autocomplete.get(interaction.commandName);
            if(!request) return;
            try {
                await request.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un autocompletado:` + err);
                return Promise.reject(err);
            };
        } else if(interaction.isModalSubmit()) {
            const commandmodal = client.modals.get(interaction.customId);
            if (!commandmodal) {
                return interaction.reply({
                    content: `Ocurrio un error!`,
                    ephemeral: true,
                });
            }
            try{
                await commandmodal.execute(interaction);
            } catch (err) {
                Utils.logger.error(`Error ejecutando un modal:` + err);
                await interaction.reply({
                    content: `Ocurrion un error!`,
                    ephemeral: true,
                });
            }
        } else if(interaction.isStringSelectMenu()) {
            const commandssm = client.select.get(interaction.customId);
            if (!commandssm) return;
            try {
                await commandssm.execute(interaction, client, Utils, Discord);
            } catch (err) {
                Utils.logger.error("Error en select menu: " + err);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                    content: "Ocurrió un error",
                    ephemeral: true
                    });
                }
            }
        }
    },
};
