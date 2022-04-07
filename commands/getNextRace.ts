import { SlashCommandBuilder,  } from '@discordjs/builders';
import axios from "axios";
import chalk from 'chalk';
import  { formatDistanceToNowStrict } from 'date-fns'
import { reminderMenu} from "../src/createReminder";

interface Races {
	[key: string]: any
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next-race')
		.setDescription('Get time until next race')
		,
	async execute(interaction: any) {
		let raceTime: Date | undefined; 
		await interaction.deferReply()
		try{
		
			const res = await axios.get('http://ergast.com/api/f1/current.json');
			const allRaces = res.data.MRData.RaceTable.Races;
			const nextRace = getNextRace(allRaces);
			
			if (nextRace !== undefined) {
				raceTime = new Date(`${nextRace.date}T${nextRace.time}`);
			}

			// console.log(raceTime, nextRace)
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
					...formatRaceMessage(nextRace, raceTime),
					{ name: '\u200B', value: '\u200B' }
				],
				timestamp: new Date(),
				footer: {
					text: 'R.I.P. Bose Headset',
					icon_url: interaction.client.user.avatarURL(),
				},
			};

			await interaction.editReply({embeds: [exampleEmbed]});

			if (raceTime) reminderMenu(interaction, raceTime);

		} catch (e) {
			await interaction.editReply('ERROR OCCURED!');
			console.error(chalk.redBright('FATAL ERROR'), e);
		}
		
	},
};

const getNextRace = (racesTable: Races[]) => {
	const now = new Date;
  let raceDate = new Date;
	for(let i = 0; i < racesTable.length; i++) {
	  raceDate = new Date(`${racesTable[i].date}T${racesTable[i].time}`)
		if (raceDate > now) {
			return racesTable[i];
		}
	}

	return undefined;
}

const formatRaceMessage = (nextRace: Races | undefined, raceTime: Date | undefined) => {
	let result: any[] = [];

	if(nextRace == undefined) {
		return [{name: 'NO MORE RACES THIS SEASON', value:'\u200B'}]
	}
	result.push({name: 'ROUND', value: nextRace.round || "NO RACE", inline: true});
	result.push({name: 'CIRCUIT', value: nextRace.raceName || "NO RACE", inline: true});
	result.push({name: 'DATE / TIME', value: `${raceTime}` || "NO RACE", inline: true});

  // calculateRemainingTime()
  const parsedDate = formatDistanceToNowStrict(raceTime!, {roundingMethod: "round"})

  result.push({ name: '\u200B', value: '\u200B' });
  result.push({ name: '\u200B', value: '\u200B' , inline: true});
  result.push({ name: 'TIME REMAINING', value: parsedDate || "NO RACE", inline: true});


	return result;
}

