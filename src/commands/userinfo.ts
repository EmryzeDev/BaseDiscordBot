import { ContextMenuCommandBuilder, ApplicationCommandType, Collection, UserContextMenuCommandInteraction } from 'discord.js'

module.exports = {
	data: new ContextMenuCommandBuilder()
        .setName('User Information')
        .setType(ApplicationCommandType.User),
	async execute(interaction) {},
	contextMenus: new Collection<string, any>()
        .set('User Information', async (interaction: UserContextMenuCommandInteraction) => {
			// Get the User's username from context menu
			const { username } = interaction.targetUser;
			await interaction.reply({ content: username, ephemeral: true });
        })
};