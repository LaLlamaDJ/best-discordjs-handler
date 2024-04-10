module.exports.triggers = function (fs, client, Collection, Discord) {
    client.triggers = new Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../triggers`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../triggers/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../triggers/${folder}/${file}`);
        client.triggers.set(command.name, command);
      }
    }
};
