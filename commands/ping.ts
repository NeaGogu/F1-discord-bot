import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: any) {
		await interaction.reply('Matei are putulica mica');
		// await interaction.reply(`http:\/\/.\/\\<\#0\>:  :\/\/.\/\<\#0\>`);
	},
};
