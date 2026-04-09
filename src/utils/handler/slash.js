module.exports.slash = function (fs, client, Discord) {
    client.slash = new Discord.Collection();
    const commandFolder = fs.readdirSync(__dirname + "/" + `../../slash`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../slash/${folder}`);
      for (const file of commandFile) {
        const command = require(__dirname + "/" + `../../slash/${folder}/${file}`);
        client.slash.set(command.data.name, command);
      }
    }
};
