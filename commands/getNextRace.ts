import { SlashCommandBuilder } from '@discordjs/builders';
import axios from "axios";
import chalk from 'chalk';
import datefns, { formatDistanceToNowStrict, getHours, getDate, getMonth, getSeconds, getMinutes, sub, add, formatDistanceStrict } from 'date-fns'
import cron from "cron";

let allRaces: any[] = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next-race')
		.setDescription('Get time until next race'),
	async execute(interaction: any) {

		try{
		
			const res = await axios.get('http://ergast.com/api/f1/current.json');
			allRaces = res.data.MRData.RaceTable.Races;

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
					...formatRaceMessage(allRaces),
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

		setReminder(interaction);
		interaction.channel.send("helo");
	},
};

const getNextRace = (racesTable: any[]) => {
	const now = new Date;
  let raceDate = new Date;
	for(let i = racesTable.length -1; i >= 0; i--) {
	  raceDate = new Date(`${racesTable[i].date}T${racesTable[i].time}`)
		if (raceDate > now) {
			return racesTable[i];
		}
	}

	return undefined;
}

const setReminder = (interaction: any) => {
	const nextRace = getNextRace(allRaces);
	if (nextRace == undefined) {
		return;
	}
	const raceTime = new Date(`${nextRace.date}T${nextRace.time}`);
	const job1String = formatCronString(add(new Date(), {minutes: 1}), {minute: true});
	console.log(job1String)
	let job1 = new cron.CronJob(job1String, () => interaction.channel.send(`RACE STARTS IN ${formatDistanceToNowStrict(raceTime)}`))
	job1.start()
}

const formatCronString = (date: Date, {second = false, minute = false, hour = true, day = true, month = true} = {}) => {
	const sec = second ? getSeconds(date) : 0
	const min = minute ? getMinutes(date) : 0
	const hrs = hour ? getHours(date) : '*'
	const day_num = day ? getDate(date) : '*'
	const mon = month ? getMonth(date) : '*'
	
	return `${sec} ${min} ${hrs} ${day_num} ${mon} *`; 
}

const formatRaceMessage = (racesTable: any[]) => {
	let result: any[] = [];

	const nextRace = getNextRace(racesTable);
	if(!nextRace) {
		return [{name: 'NO MORE RACES THIS SEASON', value:'\u200B'}]
	}

	const raceTime = new Date(`${nextRace.date}T${nextRace.time}`);

	result.push({name: 'ROUND', value: nextRace.round || "NO RACE", inline: true});
	result.push({name: 'CIRCUIT', value: nextRace.raceName || "NO RACE", inline: true});
	result.push({name: 'DATE / TIME', value: `${nextRace.date}T${nextRace.time}` || "NO RACE", inline: true});

  // calculateRemainingTime()
  const parsedDate = formatDistanceToNowStrict(raceTime, {roundingMethod: "round"})

  result.push({ name: '\u200B', value: '\u200B' });
  result.push({ name: '\u200B', value: '\u200B' , inline: true});
  result.push({ name: 'TIME REMAINING', value: parsedDate || "NO RACE", inline: true});


	return result;
}

