import { SlashCommandBuilder } from '@discordjs/builders';
import axios from "axios";
import chalk from 'chalk';
import ms from 'ms';
import datefns, { formatDistanceToNowStrict, add } from 'date-fns'


module.exports = {
	data: new SlashCommandBuilder()
		.setName('next-race')
		.setDescription('Get time until next race'),
	async execute(interaction: any) {
		try{
		
			const res = await axios.get('http://ergast.com/api/f1/current.json');
			const allRaces = res.data.MRData.RaceTable.Races;

			const exampleEmbed = {
				color: 0x0099ff,
				title: 'Next Race',
				url: 'http://ergast.com/api/f1/current',
				author: {
					name: interaction.client.user.username,
					icon_url: interaction.client.user.avatarURL(),
					url: 'https://discord.js.org',
				},
				description: `Next race in season ${res.data.MRData.RaceTable.season}`,
				thumbnail: {
					url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1PxSv365hMfEo6evOMRWzmcBbU0wOaLJMkw&usqp=CAU',
				},
				fields:[
					{ name: '\u200B', value: '\u200B' },
					...getRemRaces(allRaces),
					{ name: '\u200B', value: '\u200B' }
				],
				timestamp: new Date(),
				footer: {
					text: 'R.I.P. Bose Headset',
					icon_url: interaction.client.user.avatarURL(),
				},
			};

			await interaction.reply({embeds: [exampleEmbed]});

		} catch (e) {
			interaction.reply('ERROR OCCURED!');
			console.error(chalk.redBright('FATAL ERROR'), e);
		}



	},
};

const getRemRaces = (racesTable: any[]) => {
	let result: any[] = [];
	let rounds= ['\n',];
	let circuits = ['\n',];
	let times = ['\n',];

	const now = Date.now();
  let raceDate: string = " ";
	for(let i = racesTable.length -1; i >= 0; i--) {
	  raceDate = `${racesTable[i].date}T${racesTable[i].time}`
		if (Date.parse(raceDate) > now) {
			rounds.push(racesTable[i].round);
			circuits.push(racesTable[i].raceName);
			times.push(`${racesTable[i].date} ${racesTable[i].time}`);
      break;
		}
	}

	if(rounds.length == 1) {
		return [{name: 'NO MORE RACES THIS SEASON', value:'\u200B'}]
	}

	result.push({name: 'ROUND', value: rounds.join('\n'), inline: true});
	result.push({name: 'CIRCUIT', value: circuits.join('\n'), inline: true});
	result.push({name: 'DATE / TIME', value: times.join('\n'), inline: true});

  // calculateRemainingTime()
  const parsedDate = formatDistanceToNowStrict(new Date(raceDate), {roundingMethod: "round"})

  result.push({ name: '\u200B', value: '\u200B' });
  result.push({ name: '\u200B', value: '\u200B' , inline: true});
  result.push({ name: 'TIME REMAINING', value: parsedDate , inline: true});


	return result;
}

