const { EmbedBuilder } = require('discord.js');

class DefaultEmbed extends EmbedBuilder {
    constructor(author, options = {}) {
        super();
        const safeAuthorName = author?.displayName || author.username || author.tag || "Usuario";

        this.setColor("Red")
        this.setFooter({
            text: `Request By ${safeAuthorName}`,
            iconURL: author?.displayAvatarURL({ dynamic: true }) || undefined
        })
        this.setTimestamp();

        if (options.title) this.setTitle(options.title);
        if (options.description) this.setDescription(options.description);
        if (options.image?.url) this.setImage(options.image.url);
        if (options.thumbnail?.url) this.setThumbnail(options.thumbnail.url);
        if (options.fields) this.addFields(options.fields);
    }
}

module.exports = DefaultEmbed;