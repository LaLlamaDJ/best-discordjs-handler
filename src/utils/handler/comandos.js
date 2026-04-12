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
        if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
      }
    }
  };