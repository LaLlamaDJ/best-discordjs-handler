module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
  },
  async execute(Discord, client, interaction) {
    interaction.reply({ content: `${client.ws.ping}ms` })
  }
}