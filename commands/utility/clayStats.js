const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const DB = require("./../../conquestDB/res.json");

module.exports = {
  data: new SlashCommandBuilder().setName("clay-stats").setDescription("cs"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xa09cb8)
      .setTitle("Stats for block Clay")
      .setAuthor({
        name: `stolen from GaviTSRA :D`,
        iconURL: `${interaction.user.defaultAvatarURL}`,
      })
      .setDescription(`Mines: ${DB.blocks.Clay.buildings.mine}`);
    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
    message.react("1063955262500786346");
  },
};
