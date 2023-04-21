import { Events } from 'discord.js'
import { ClientExt } from '../index'

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute: (client: ClientExt) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	}
}