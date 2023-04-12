const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('send-embed')
    .setDescription('Hey look, an embed!')
    .addStringOption(option =>
        option.setName('url')
        .setDescription('URL for the thumbnail (Include http(s)://')),
        
        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Hey look, an embed!')
                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` })
                .setDescription('an embed :O')
                .setThumbnail(`${interaction.options.getString('url')}`);
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            message.react('1063955262500786346')
    }
}