const Guild = require("../../models/guildSchema");

async function getGuild(guildId) {
    let guild = await Guild.findOne({ guildId });
    if (!guild) {
        guild = await Guild.create({ guildId });
    }
    return guild;
}

async function getPrefix(guildId) {
    const guild = await getGuild(guildId);
    return guild.prefix;
}

async function setPrefix(guildId, newPrefix) {
    await Guild.updateOne(
        { guildId },
        { prefix: newPrefix },
        { upsert: true }
    );
}

module.exports = {
    getGuild,
    getPrefix,
    setPrefix
};