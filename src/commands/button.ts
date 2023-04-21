import { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ChatInputCommandInteraction, Collection, ButtonInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('Click the button!'),
    async execute (interaction : ChatInputCommandInteraction) {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false)
                    .setEmoji('1086636936271233145')
            );
            
		const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');

        await interaction.reply({ content: 'I think you should,', ephemeral: true, embeds: [embed], components: [row] });
    },
    buttons: new Collection<string, any>()
        .set('primary', async (interaction: ButtonInteraction) => {
            interaction.update({ content: 'A button was clicked!', components: []})
        })
};