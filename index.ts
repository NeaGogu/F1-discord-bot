import { Intents, Collection } from 'discord.js';
import NewClient from './types/NewClient';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config()

const client = new NewClient({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


client.once('ready', () => {
	console.log('Ready!');

});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands!.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);
