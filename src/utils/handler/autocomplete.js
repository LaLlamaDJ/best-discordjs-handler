module.exports.autocomplete = function (fs, client, Collection, Discord) {
    client.autocomplete = new Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../interactions/autocomplete`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../interactions/autocomplete/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../interactions/autocomplete/${folder}/${file}`);
        client.autocomplete.set(command.name, command)  
      }
    }
  };
