import * as express from "express";
import { readLogFileByRound } from "./logReader/logReader";
import { collectRoundInfo, collectDeathsReport } from "./roundKillsCollector/roundKillsCollector";

const app = express();

app.get('/game-data',  async (_req: express.Request, res: express.Response) => {
  const gameData = await readLogFileByRound({ collectorFunction: collectRoundInfo });

  return res.status(200).json(gameData);
});

app.get('/deaths-report',  async (_req: express.Request, res: express.Response) => {
  const gameData = await readLogFileByRound({ collectorFunction: collectDeathsReport });

  return res.status(200).json(gameData);
});

app.listen(8080, () => {
  console.info(`server started: http://localhost:${8080}`);
  console.info(`[GET]: http://localhost:8080/game-data`);
  console.info(`[GET]: http://localhost:8080/deaths-report`);
});