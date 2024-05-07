import * as fs from 'fs';
import { readLogFileByRound } from './logReader';
import { collectDeathsReport, collectRoundInfo } from '../roundKillsCollector/roundKillsCollector';
import { CollectRoundInfoFunction } from '../game.types';

describe('readLogFileByRound', () => {
  const mockContent = `
    22:45 InitGame: 10
    22:45 ClientUserinfoChanged: 2 n\\Player1\\t\\0
    22:45 ClientUserinfoChanged: 3 n\\Player2\\t\\0
    22:45 ClientUserinfoChanged: 2 n\\Player3\\t\\0
    22:45 ClientUserinfoChanged: 3 n\\Player4\\t\\0
    22:45 ClientUserinfoChanged: 2 n\\Player5\\t\\0
    22:45 ClientUserinfoChanged: 3 n\\Player6\\t\\0
    22:46 Kill: Player1 killed Player2 by MOD_ROCKET
    22:47 Kill: Player3 killed Player4 by MOD_SHOTGUN
    22:48 Kill: Player5 killed Player6 by MOD_RAILGUN
    22:49 InitGame: 10
    22:49 ClientUserinfoChanged: 3 n\\Player7\\t\\0
    22:49 ClientUserinfoChanged: 3 n\\Player8\\t\\0
    22:50 Kill: Player7 killed Player8 by MOD_ROCKET
    22:51 InitGame: 10
  `;

  beforeEach(() => {
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(mockContent);
  });

  const mockCollectorFunctionWithDeaths: CollectRoundInfoFunction = async (lines, startingLine) => {
    return collectDeathsReport(lines, startingLine);
  };

  const mockCollectorFunctionWithRoundInfo: CollectRoundInfoFunction = async (lines, startingLine) => {
    return collectRoundInfo(lines, startingLine);
  };

  test('should correctly read log file and collect data by round with collectDeathsReport', async () => {
    const result = await readLogFileByRound({ collectorFunction: mockCollectorFunctionWithDeaths });

    expect(result).toEqual({
      game_1: {
        kills_by_means: {
          MOD_ROCKET: 1,
          MOD_SHOTGUN: 1,
          MOD_RAILGUN: 1,
        },
      },
      game_2: {
        kills_by_means: {
          MOD_ROCKET: 1,
        },
      },
      game_3: undefined,
    });
  });

  test('should correctly read log file and collect data by round with collectRoundInfo', async () => {
    const result = await readLogFileByRound({ collectorFunction: mockCollectorFunctionWithRoundInfo });

    expect(result).toStrictEqual({
      game_1: {
        total_kills: 3,
        players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6'],
        kills: {
          Player1: 1,
          Player2: 0,
          Player3: 1,
          Player4: 0,
          Player5: 1,
          Player6: 0,
        },
      },
      game_2: {
        total_kills: 1,
        players: ['Player7', 'Player8'],
        kills: {
          Player7: 1,
          Player8: 0,
        },
      },
      game_3: {
        total_kills: 0,
        players: [],
        kills: {},
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
