module.exports.triggers = function (fs, client, Discord) {
    client.triggers = new Discord.Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../triggers`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../triggers/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../triggers/${folder}/${file}`);
        client.triggers.set(command.name, command);
      }
    }
};
