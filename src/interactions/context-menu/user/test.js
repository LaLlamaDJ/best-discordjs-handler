const { ApplicationCommandType } = require('discord.js');

module.exports = {
	data: {
		name: "sample",
		type: ApplicationCommandType.User,
	},
	async execute(interaction) {
		await interaction.reply({
			content: "Tu menu contextual de usuario funciona!",
		});
		return;
	},
};
