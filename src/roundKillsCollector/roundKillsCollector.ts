import { CollectRoundInfoFunction } from "../game.types";
import { MeansOfDeath } from "../game.types";

const KILL_REGEX = /(?<=: )([^:]+) killed ([^:]+) by ([^:]+)/;
const NAME_REGEX = /(?<=n\\)(.*?)(?=\\t\\)/;

export const extractKillsInfos = (line: string) => {
  const matchKill = line.match(KILL_REGEX);
  if (matchKill) {
    const [_, killer, victim, meanOfDeath] = matchKill.map(match => match.trim());
    if (!Object.values(MeansOfDeath).includes(meanOfDeath)) {
      console.error("The value is not valid.");
    }
    return { killer, victim, meanOfDeath };
  }
  return null;
}

export const extractPlayerName = (line: string) => {
  const match = line.match(NAME_REGEX);
  return match ? match[0] : null;
}

// Collect information about deaths in a round
export const collectDeathsReport: CollectRoundInfoFunction = async (lines, startingLine) => {
  const listOfMeans: {[key: string]: number} = {};

  for (let i = startingLine; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Kill")) {
      const killInfo = extractKillsInfos(line);
      if (killInfo && killInfo.meanOfDeath) {
        listOfMeans[killInfo.meanOfDeath] = (listOfMeans[killInfo.meanOfDeath] || 0) + 1;
      }
    } else if (line.includes("InitGame")) {
      return { kills_by_means: listOfMeans };
    }
  }
}

// Collect information about the round
export const collectRoundInfo: CollectRoundInfoFunction = async (lines, startingLine) => {
  let totalKills = 0;
  const playersOnMatch: {[key: string]: boolean} = {};
  const kills: {[key: string]: number} = {};

  for (let i = startingLine; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Kill")) {
      const killInfo = extractKillsInfos(line);
      if (killInfo) {
        totalKills++;

        const { killer, victim } = killInfo;
        // check killer or victim
        const victimOrKiller = killer === '<world>' || killer === victim ? victim : killer;
        // killed by world or killer yourself
        const killValue = killer === '<world>' || killer === victim ? -1 : 1;
        // killed another player
        kills[victimOrKiller] = (kills[victimOrKiller] || 0) + killValue;
      }
    } else if (line.includes("ClientUserinfoChanged")) {
      const playerName = extractPlayerName(line);
      if (playerName){
        playersOnMatch[playerName] = true;
        
        // this prevent to reset player kills
        if (!(playerName in kills)) {
          kills[playerName] = 0;
        }
      }

    } else if (line.includes("InitGame")) {
      return { total_kills: totalKills, players: Object.keys(playersOnMatch), kills };
    }
  }

  return { total_kills: totalKills, players: Object.keys(playersOnMatch), kills };
}
