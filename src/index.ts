import * as dotenv from 'dotenv'
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Client, GatewayIntentBits, Collection, TextChannel, ComponentType, GuildMember } from 'discord.js';
import { startTrial } from './trial_info';

dotenv.config()

export class ClientExt extends Client {
	commands: Collection<string, any>;
	buttons: Collection<string, any>;
	stringSelections: Collection<string, any>;
	modals: Collection<string, any>;
	contextMenus: Collection<string, any>;
}

export const client = new ClientExt({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.buttons = new Collection();
client.stringSelections = new Collection();
client.modals = new Collection();
client.contextMenus = new Collection();

// Handler for commands and their components
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

async function addCommand(filePath) {
	const { default: command } = await import(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
	if ('buttons' in command) {
		const buttons : Collection<string, any> = command.buttons;
		buttons.forEach((execute: any, name: string) => {
			client.buttons.set(name, execute)
		});
	}
	if ('stringSelections' in command) {
		const stringSelections : Collection<string, any> = command.stringSelections;
		stringSelections.forEach((execute: any, name: string) => {
			client.stringSelections.set(name, execute)
		});
	}
	if ('modals' in command) {
		const modals : Collection<string, any> = command.modals;
		modals.forEach((execute: any, name: string) => {
			client.modals.set(name, execute)
		});
	}
	if ('contextMenus' in command) {
		const contextMenus : Collection<string, any> = command.contextMenus;
		contextMenus.forEach((execute: any, name: string) => {
			client.contextMenus.set(name, execute)
		});
	}
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	addCommand(filePath);
}

//	Events handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const { name, once, execute } = require(filePath);
	if (once===true) {
		client.once(name, (...args) => execute(client, ...args));
	} else {
		client.on(name, (...args) => execute(client, ...args));
	}
}

client.login(process.env.BOT_TOKEN);