module.exports = {
	data: {
		name: "sample",
		type: 2, //2 para usuario - 1 para mensaje
	},
	async execute(interaction) {
		await interaction.reply({
			content: "Tu menu contextual de usuario funciona!",
		});
		return;
	},
};
