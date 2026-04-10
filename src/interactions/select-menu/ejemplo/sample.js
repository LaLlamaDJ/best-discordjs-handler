module.exports = {
	id: "sample",
	async execute(interaction) {
		await interaction.reply({
			content: "Esta es una respuesta del menu handler!",
		});
		return;
	},
};
