import { IReadLogFileByRound } from "../game.types";

const fs = require('fs');

export const readLogFileByRound = async ({
  collectorFunction,
  filePath = '../logs/qgames.log',
  startingLine = 0 
}: IReadLogFileByRound): Promise<any> => {
  try {
      const content = await fs.promises.readFile(`${__dirname}\\${filePath}`, 'utf8');
      const lines = content.split('\n');
      let gameNumber = 0;
      let gameData: {[key: string]: any} = {};

      for (let i = (startingLine); i < lines.length; i++) {
        if (lines[i].includes("InitGame")) {
            gameNumber++;
            const killsInGame = await collectorFunction(lines, i + 1);
            gameData[`game_${gameNumber}`] = killsInGame;
        }
      }

      return gameData;
  } catch (err) {
      console.error('Error reading file:', err);
  }
}
