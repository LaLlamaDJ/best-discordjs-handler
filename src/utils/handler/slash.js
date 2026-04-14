module.exports.slash = function (fs, client, Discord) {
  if(!client.slash) {
    client.slash = new Discord.Collection();
  } else {
    client.slash.clear();
  }
  const commandFolder = fs.readdirSync(__dirname + "/" + `../../slash`);
    for (const folder of commandFolder) {
      const commandFile = fs.readdirSync(__dirname + "/" + `../../slash/${folder}`);
      for (const file of commandFile) {
        if(!file.endsWith(".js")) continue;
        delete require.cache[require.resolve(__dirname + "/" + `../../slash/${folder}/${file}`)];
        const command = require(__dirname + "/" + `../../slash/${folder}/${file}`);
        if(!command?.data?.name) continue;
        client.slash.set(command.data.name, command);
      }
    }
};
