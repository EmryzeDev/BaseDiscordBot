import { GuildMember, User } from "discord.js";
import * as fs from 'node:fs';
import { client } from "..";
import moment from 'moment';

export const trialsFilePath = 'trial_info.json';

interface TrialUser {
    id: string;
    trialStart: Date;
    trialEnd: Date;
}

interface TrialUsers {
    inTrial: TrialUser[];
    usedTrial: TrialUser[];
}

let trialData = initConfig();

function initConfig(): TrialUsers {
    if (fs.existsSync(trialsFilePath)===false) {
        const data: TrialUsers = {
            inTrial: [],
            usedTrial: []
        }
        fs.writeFileSync(trialsFilePath, JSON.stringify(data, null, 2));
    }
    fs.watch(trialsFilePath, (eventType, filename) => {
        if (eventType === 'change' && filename === trialsFilePath) {
            try {
                trialData = JSON.parse(fs.readFileSync(trialsFilePath, 'utf-8'));
            } catch {
                console.log('incorrect syntax in trials.json');
            }
        }
    })
    return JSON.parse(fs.readFileSync(trialsFilePath, 'utf-8'))
}

export function endDate(user: User): Date {
    // Find the user in the inTrial array
    const userIndex = trialData.inTrial.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
        throw new Error('User is not in trial.');
    }

    // Return the user's trial end date
    return moment(trialData.inTrial[userIndex].trialEnd).toDate();
}

export function startTrial(member: GuildMember, trialLength: number, override?: boolean) {
    const trialEnd = moment().add(trialLength, 'days').toDate();

    if (override) clearMemberFromLog(member)

    // Check if user is already in trial or has used their trial
    const inTrial = trialData.inTrial?.find(u => u.id === member.id);
    const usedTrial = trialData.usedTrial?.find(u => u.id === member.id);
    if (inTrial) {
        throw new Error('Already in trial.');
    } else if (usedTrial) {
        throw new Error('Trial period has ended.');
    }

    // Add user to inTrial array
    trialData.inTrial.push({
        id: member.id,
        trialStart: new Date(),
        trialEnd
    });

    // Write updated data to file
    fs.writeFileSync(trialsFilePath, JSON.stringify(trialData, null, 2))

    // Assign trial role
    const role = member.guild.roles.cache.get(process.env.TRIAL_ROLE)
    if (role) member.roles.add(role)
}

export function endTrial(member: GuildMember) {
    if (!member) return
    // Find the user in the inTrial array
    const userIndex = trialData.inTrial.findIndex(u => u.id === member.id);
    if (userIndex === -1) {
        throw new Error('User is not in trial.');
    }

    // Remove the user from the inTrial array and add them to the usedTrial array
    const userInTrial = trialData.inTrial.splice(userIndex, 1)[0];
    trialData.usedTrial.push(userInTrial);

    // Write updated data to file
    fs.writeFileSync(trialsFilePath, JSON.stringify(trialData, null, 2))

    // Remove trial role
    const role = member.guild.roles.cache.get(process.env.TRIAL_ROLE)
    if (role) member.roles.remove(role)
}

export function clearMemberFromLog(member: GuildMember) {
    // Find the user index in the inTrial array
    const inTrialIndex = trialData.inTrial.findIndex(u => u.id === member.id);
    if (inTrialIndex !== -1) {
      // Remove user from inTrial array
      trialData.inTrial.splice(inTrialIndex, 1);
    }
  
    // Find the user index in the usedTrial array
    const usedTrialIndex = trialData.usedTrial.findIndex(u => u.id === member.id);
    if (usedTrialIndex !== -1) {
      // Remove user from usedTrial array
      trialData.usedTrial.splice(usedTrialIndex, 1);
    }
  
    // Write updated data to file
    fs.writeFileSync(trialsFilePath, JSON.stringify(trialData, null, 2));
  }

function sync() {
    const guild = client.guilds.cache.get(process.env.GUILD_ID)
    const currentDate = moment().toDate();
    trialData.inTrial.forEach((user) => {
        if (moment(currentDate).isAfter(user.trialEnd)) {
            endTrial(guild.members.cache.get(user.id))
        }
    });
}

// Sync every hour
setInterval(sync, 60 * 60 * 1000)