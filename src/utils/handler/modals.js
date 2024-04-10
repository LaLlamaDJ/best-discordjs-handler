module.exports.modals = function (fs, client, Collection, Discord) {
    client.modals = new Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../interactions/modals`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../interactions/modals/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../interactions/modals/${folder}/${file}`);
        client.modals.set(command.id, command)
      }
    }
  };
