const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lab-calc')
        .setDescription('Calculate how many mines and training camps you need.')
        .addIntegerOption(option =>
            option.setName('labs')
            .setDescription('How many labs do you want?')),

    async execute(interaction) {
        const mines = 1 * interaction.options.getInteger('labs');
        const camps = 4 * interaction.options.getInteger('labs');
        await interaction.reply(`You need ${camps} training camp(s) and ${mines} mine(s) for ${interaction.options.getInteger('labs')} lab(s) (rounded)`);
    }
}