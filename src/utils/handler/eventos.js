module.exports.eventos = function (fs, client) {
    if(!client._eventHandlers) client._eventHandlers = new Map();
    for(const [event, handlers] of client._eventHandlers) {
      for(const handler of handlers) {
        client.off(event, handler);
      }
    }
    client._eventHandlers.clear();

    const eventFolder = fs.readdirSync(__dirname + "/" + `../../events`);
    for (const folder of eventFolder) {
      const eventFile = fs.readdirSync(__dirname + "/" + `../../events/${folder}`);
      for (const file of eventFile) {
        if(!file.endsWith(".js")) continue;
        delete require.cache[require.resolve(__dirname + "/" + `../../events/${folder}/${file}`)];
        const event = require(__dirname + "/" + `../../events/${folder}/${file}`);
        if(!event.name || !event.execute) continue;
        const handler = (...args) => event.execute(...args, client)
        if(!client._eventHandlers.has(event.name)) {
          client._eventHandlers.set(event.name, []);
        }
        client._eventHandlers.get(event.name).push(handler);
        if (event.once) {
          client.once(event.name, handler);
        } else {
          client.on(event.name, handler);
        }
      }
    }
  };