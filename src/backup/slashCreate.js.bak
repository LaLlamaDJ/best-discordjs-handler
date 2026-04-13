const { Events, Discord } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    once: true,
    async execute(interaction, client){
        if(!interaction.isChatInputCommand()) return;
        if(interaction.isCommand()){
            const command = client.slash.get(interaction.commandName.toLowerCase())
            if(!command) return interaction.reply({ 
                content: `${interaction.commandName.toLowerCase()} no es un comando valido!`,
                ephemeral: true,
            })
            try {
                await command.execute(Discord, client, interaction)
            } catch(error) {
                console.log(error)
                interaction.reply({
                    content: "Ocurrio un error!",
                    ephemeral: true,
                })
            }
        }
    },
};
