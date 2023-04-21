import { SlashCommandBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, ChatInputCommandInteraction, ModalActionRowComponentBuilder, ModalSubmitInteraction, EmbedBuilder, Channel, TextChannel, Collection, PermissionFlagsBits } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report an issue to the moderator team'),
    async execute(interaction : ChatInputCommandInteraction) {
		const modal = new ModalBuilder()
        .setCustomId('reportModal')
        .setTitle('Report form');

        const descriptionInput = new TextInputBuilder()
			.setCustomId('description')
			.setLabel("Please describe the issue you want to report.")
			.setStyle(TextInputStyle.Paragraph)

        const description = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
        modal.addComponents(description);

		await interaction.showModal(modal);
    },
	modals: new Collection<string, any>()
		.set('reportModal', async (interaction: ModalSubmitInteraction) => {
			const description = interaction.fields.getTextInputValue('description');
            const modAppEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`})
                .setDescription('Report')
                .setTimestamp()
                .setDescription(description)

            // change channel to your 'reports channel'
            const channel = interaction.channel
            if (channel && channel instanceof TextChannel && channel.viewable && interaction.guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) {
                await channel.send({ embeds: [modAppEmbed] });
                await interaction.reply({ content: 'Thank you for your report, our moderation team will investigate the issue as soon as possible.', ephemeral:true });
            } else await interaction.reply({ content: 'Could not send report, please contact an admin or moderator', ephemeral:true });
			
		})
};