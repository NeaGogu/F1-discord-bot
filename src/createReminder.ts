import { formatDistanceToNowStrict, getHours, getDate, getMonth, getSeconds, getMinutes, sub, add } from 'date-fns'
import cron from "cron";
import { MessageButton, MessageActionRow } from 'discord.js';

const ACTIVE_REMINDERS: cron.CronJob[] = [];

export const reminderMenu = (interaction: any, time: Date) => {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
	    .setCustomId('setReminder')
	    .setLabel('Yes')
      .setStyle('SUCCESS'),
    new MessageButton()
	    .setCustomId('noSetReminder')
	    .setLabel('No')
      .setStyle('DANGER'),

  ) 
  
  interaction.channel.send({
    content: "Do you want to set a reminder?",
    components: [row],
  })

  const filter = (newInterraction: any) => {
    if (ACTIVE_REMINDERS.length == 0 && interaction.user.id === newInterraction.user.id) return true;
    else if (ACTIVE_REMINDERS.length > 0) {
      interaction.channel.send({content: "Reminder already set!!"})
      return false;
    }
    interaction.channel.send({content: "You cannot use this button!"})
    return false;
  }

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    max: 1
  })

  // TODO: Add logging to reminder events
  // TODO: Add option to remove reminder
  collector.on('end', (buttInteaction: any) => {
    if (buttInteaction.first().customId === "setReminder") {
      setReminder(interaction, time);
      interaction.channel.send({content: "Reminder set!"});
      return buttInteaction.first().deferUpdate()
    }
    if (buttInteaction.first().customId === "noSetReminder") {
      interaction.channel.send("No reminder set");
    }
    return buttInteaction.first().deferUpdate()
  })

}


export const setReminder = async (interaction: any, time: Date) => {

	// const job1String = formatCronString(add(new Date(), {minutes: 1}), {minute: true});
  
  const now = new Date();
	let job1 = new cron.CronJob(add(now, {minutes: 1}), () => interaction.channel.send(`RACE STARTS IN ${formatDistanceToNowStrict(time)} at ${time}`))
	let job2 = new cron.CronJob(add(now, {minutes: 2}), () => interaction.channel.send(`RACE STARTS IN ${formatDistanceToNowStrict(time)}`))
	let job3 = new cron.CronJob(add(now, {minutes: 3}), () => interaction.channel.send(`RACE STARTS IN ${formatDistanceToNowStrict(time)} at ${time}` ))

  ACTIVE_REMINDERS.push(job1, job2, job3);

	job1.start();
  job2.start();
  job3.start();
}

const formatCronString = (date: Date, {second = false, minute = false, hour = true, day = true, month = true} = {}) => {
	const sec = second ? getSeconds(date) : 0
	const min = minute ? getMinutes(date) : 0
	const hrs = hour ? getHours(date) : '*'
	const day_num = day ? getDate(date) : '*'
	const mon = month ? getMonth(date) : '*'
	
	return `${sec} ${min} ${hrs} ${day_num} ${mon} *`; 
}
