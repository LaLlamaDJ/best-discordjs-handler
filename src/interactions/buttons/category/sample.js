module.exports = {
	id: "sample",
	async execute(interaction) {
		await interaction.reply({
			content: "Esta respuesta es de tu button handler!",
		});
		return;
	},
};
