const Utils = require("../index")
module.exports.comandos = function (fs, client, Discord) {
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.cooldowns = new Discord.Collection();

    const commandFolder = fs.readdirSync(__dirname + "/" + `../../commands`);
    for (const folder of commandFolder) {
        const commandFile = fs.readdirSync(__dirname + "/" + `../../commands/${folder}`);
        for (const file of commandFile) {
            const command = require(__dirname + "/" + `../../commands/${folder}/${file}`);
            command.category =
                folder.charAt(0).toUpperCase() +
                folder.slice(1).toLowerCase();
            client.commands.set(command.name, command);
            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => client.aliases.set(alias, command.name));
            }
        }
    }
    client.slashData = [];

    function mapType(type) {
        const types = {
            string: 3,      // STRING
            number: 10,     // NUMBER
            boolean: 5,     // BOOLEAN
            user: 6,        // USER
            member: 6,      // USER
            channel: 7,     // CHANNEL
            role: 8         // ROLE
        };
        return types[type] || 3;
    }

    client.commands.forEach(cmd => {
        if (cmd.slash === false) return;
        const data = {
            name: cmd.name,
            description: cmd.description || "Sin descripción",
            options: []
        };
        if (cmd.argsSchema) {
            for (const arg of cmd.argsSchema) {
                data.options.push({
                    name: arg.name.toLowerCase(),
                    description: arg.description || `Argumento ${arg.name}`,
                    type: mapType(arg.type),
                    required: arg.required || false,
                    choices: arg.choices
                        ? arg.choices.map(c => ({ name: c, value: c }))
                        : undefined,
                    min_value: arg.min,
                    max_value: arg.max
                });
            }
        }
        client.slashData.push(data);
    });
    Utils.logger.success(`${client.slashData.length} slash commands generados automáticamente`);
};