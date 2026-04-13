module.exports.buttons = function (fs, client, Discord) {
    client.buttons = new Discord.Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../interactions/buttons`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../interactions/buttons/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../interactions/buttons/${folder}/${file}`);
        client.buttons.set(command.id, command) 
      }
    }
  };
