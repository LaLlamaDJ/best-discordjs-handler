const { ApplicationCommandType } = require('discord.js');

module.exports = {
	data: {
		name: "sample",
		type: ApplicationCommandType.Message,
	},
	async execute(interaction) {
		await interaction.reply({
			content: "Tu menu contextual de mensaje funciona!",
		});
		return;
	},
};