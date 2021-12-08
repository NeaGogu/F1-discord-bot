import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import axios from "axios";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('driver-standings')
		.setDescription('Gets current driver standings!'),
	async execute(interaction: any) {
		try {

			const response = await axios.get('http://ergast.com/api/f1/current/driverStandings.json');

			const driverStandings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
			const exampleEmbed = {
				color: 0x0099ff,
				title: 'Current Driver Standings',
				url: 'https://discord.js.org',
				author: {
					name: interaction.client.user.username,
					icon_url: interaction.client.user.avatarURL(),
					url: 'https://discord.js.org',
				},
				description: `Season ${response.data.MRData.StandingsTable.season}`,
				thumbnail: {
					url: 'https://preview.redd.it/rn2sgo2yy9q21.jpg?auto=webp&s=01cdbcbed3d1eb8f25a8103d8f9d655216fdaa46',
				},
				fields:[
					{ name: '\u200B', value: '\u200B' },
					...getListStandings(driverStandings),
					{ name: '\u200B', value: '\u200B' }
				],
				timestamp: new Date(),
				footer: {
					text: 'R.I.P. Bose Headset',
					icon_url: interaction.client.user.avatarURL(),
				},
			};
					
			interaction.reply({ embeds: [exampleEmbed] });

		} catch (e) {
			console.log(e);
		}
			
	},
};

const getListStandings = (driverStandings: any[]) => {
	let result: any[] = [];
	let names= [];
	let ranks = [];
	let points = [];

	for( const driver of driverStandings) {
		ranks.push(driver.position);
		names.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
		points.push(`${driver.wins} / ${driver.points}`);
	}

	result.push({name: 'RANK', value: ranks.join('\n'), inline: true});
	result.push({name: 'NAME', value: names.join('\n'), inline: true});
	result.push({name: 'WINS / POINTS', value: points.join('\n'), inline: true});

	return result;
}