module.exports.context = function (fs, client, Collection, Discord) {
    client.context = new Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../interactions/context-menu`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../interactions/context-menu/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../interactions/context-menu/${folder}/${file}`);
        const keyName = `${folder.toUpperCase()} ${command.data.name}`;
        client.context.set(keyName, command)
      }
    }
  };
