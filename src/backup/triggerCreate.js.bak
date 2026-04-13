const { Events } = require("discord.js")
const { prefix } = require("../public/botconfig.json")

module.exports = {
    name: Events.MessageCreate,
    execute(message, client, MessageEmbed, Util){
        if(message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);

        let triggered = false;

        message.client.triggers.every((trigger) => {
            if(triggered) return false;

            trigger.name.every(async (name) => {
                if(triggered) return false;

                if(message.content.includes(name)) {
                    try {
                        trigger.execute(message, args);
                    } catch (err) {
                        console.error(err);
                        message.reply({
                            content: "Ocurrio un error!"
                        });
                    }

                    triggered = false;
                    return false;
                }
            });
        });
    },
};
