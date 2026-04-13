const DefaultEmbed = require('./others/defaultembed');

module.exports = {
    config: require('../public/botconfig.json'),
    embed: (author, options) => new DefaultEmbed(author, options),
    dgif: require('./others/gifsprovider'),
    logger: require('./others/logger'),
    fetch: require('./others/fetch'),
    db: {
        guild: require('./database/guild'),
        connect: require('./database').connectDB
    }
};