const DefaultEmbed = require('./others/defaultembed');
const dgif = require('./others/gifsprovider');
const logger = require('./others/logger');
const fetch = require('./others/fetch');
const config = require('../public/botconfig.json');

module.exports = {
    config,
    embed: (author, options) => new DefaultEmbed(author, options),
    dgif,
    logger,
    fetch,
};