import { Events, Interaction, ButtonInteraction, ChatInputCommandInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { ClientExt } from '../index';

module.exports = {
	name: Events.InteractionCreate,
	async execute(client: ClientExt, interaction: Interaction) {
		try {
			if (interaction instanceof ChatInputCommandInteraction) {
				const command = client.commands.get(interaction.commandName);
				if (!command) {
					console.error(`No command matching ${interaction.commandName} was found.`);
					return;
				}
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(`Error executing command ${interaction.commandName}`);
					console.error(error);
				}

			} else if (interaction instanceof ButtonInteraction) {
				if (client.buttons.has(interaction.customId)) {
					try {
						const buttonfunc = await client.buttons.get(interaction.customId);
						buttonfunc(interaction);
					} catch (error) {
						console.error(`Error handling button ${interaction.customId}`);
						console.error(error);
					}
				}

			} else if (interaction instanceof StringSelectMenuInteraction){
				if (client.stringSelections.has(interaction.customId)) {
					try {
						const stringSelectionfunc = await client.stringSelections.get(interaction.customId);
						stringSelectionfunc(interaction);
					} catch (error) {
						console.error(`Error handling StringSelectMenu ${interaction.customId}`);
						console.error(error);
					}
				}

			} else if (interaction instanceof ModalSubmitInteraction) {
				if (client.modals.has(interaction.customId)) {
					try {
						const modalfunc = await client.modals.get(interaction.customId);
						modalfunc(interaction);
					} catch (error) {
						console.error(`Error executing modal ${interaction.customId}`);
						console.error(error);
					}
				}

			} else if (interaction instanceof UserContextMenuCommandInteraction) {
				if (client.contextMenus.has(interaction.commandName)) {
					try {
						const contextfunc = await client.contextMenus.get(interaction.commandName);
						contextfunc(interaction);
					} catch (error) {
						console.error(`Error executing user contextmenu ${interaction.commandName}`);
						console.error(error);
					}
				}

			} else if (interaction instanceof MessageContextMenuCommandInteraction) {
				if (client.contextMenus.has(interaction.commandName)) {
					try {
						const contextfunc = await client.contextMenus.get(interaction.commandName);
						contextfunc(interaction);
					} catch (error) {
						console.error(`Error executing message contextmenu ${interaction.commandName}`);
						console.error(error);
					}
				}
			}
		} catch {
			console.log('eventhandler failed')
		}
	}
};