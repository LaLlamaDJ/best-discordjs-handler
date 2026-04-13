module.exports.select = function (fs, client, Discord) {
    client.select = new Discord.Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../interactions/select-menu`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../interactions/select-menu/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../interactions/select-menu/${folder}/${file}`);
        client.select.set(command.id, command)
      }
    }
  };
