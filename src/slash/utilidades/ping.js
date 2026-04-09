module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
  },
  async execute(interaction, client, Utils, Discord) {
    interaction.reply({ content: `${ await client.ws.ping}ms` })
  }
}