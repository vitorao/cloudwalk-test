import { extractKillsInfos, extractPlayerName, collectDeathsReport, collectRoundInfo } from './roundKillsCollector';


describe('extractKillsInfos', () => {
  test('should extract death information correctly', () => {
    const line = '22:45 Kill: Player1 killed Player2 by MOD_RAILGUN';
    expect(extractKillsInfos(line)).toEqual({
      killer: 'Player1',
      victim: 'Player2',
      meanOfDeath: 'MOD_RAILGUN'
    });
  });

  test('should return null when there is no valid death information', () => {
    const line = '22:45 Player1 connected';
    expect(extractKillsInfos(line)).toBeNull();
  });
});

describe('extractPlayerName', () => {
  test('should extract player name correctly', () => {
    const line = '22:45 ClientUserinfoChanged: 2 n\\Player1\\t\\';
    expect(extractPlayerName(line)).toBe('Player1');
  });

  test('should return null when there is no valid player name', () => {
    const line = '22:45 Kill: Player1 killed Player2 by MOD_ROCKET';
    expect(extractPlayerName(line)).toBeNull();
  });
});

describe('collectDeathsReport', () => {
  test('should return correct death count by mean of death', async () => {
    const lines = [
      '22:45 Kill: Player1 killed Player2 by MOD_ROCKET',
      '22:46 Kill: Player3 killed Player4 by MOD_SHOTGUN',
      '22:47 Kill: Player5 killed Player6 by MOD_RAILGUN',
      '22:48 Kill: Player7 killed Player8 by MOD_ROCKET',
      '22:49 InitGame: 10',
    ];
    const result = await collectDeathsReport(lines, 0);
    expect(result).toEqual({
      kills_by_means: {
        MOD_ROCKET: 2,
        MOD_SHOTGUN: 1,
        MOD_RAILGUN: 1,
      },
    });
  });

  test('should return empty when there are no death lines', async () => {
    const lines = [
      '22:45 InitGame: 10',
    ];
    const result = await collectDeathsReport(lines, 0);
    expect(result).toStrictEqual({kills_by_means: {}});
  });
});

describe('collectRoundInfo', () => {
  test('should return correct total kills and player list', async () => {
    const lines = [
      '22:45 Kill: Player1 killed Player2 by MOD_ROCKET',
      '22:46 Kill: Player3 killed Player4 by MOD_SHOTGUN',
      '22:47 Kill: Player5 killed Player6 by MOD_RAILGUN',
      '22:48 Kill: Player7 killed Player8 by MOD_ROCKET',
      '22:49 InitGame: 10',
    ];
    const result = await collectRoundInfo(lines, 0);
    expect(result).toEqual({
      total_kills: 4,
      players: [],
      kills: {
        Player1: 1,
        Player3: 1,
        Player5: 1,
        Player7: 1,
      },
    });
  });

  test('should handle lines with ClientUserinfoChanged correctly', async () => {
    const lines = [
      '22:45 ClientUserinfoChanged: 2 n\\Player1\\t\\',
      '22:49 InitGame: 10',
    ];
    const result = await collectRoundInfo(lines, 0);
    expect(result).toEqual({
      total_kills: 0,
      players: ['Player1'],
      kills: {
        Player1: 0
      },
    });
  });

  test('should return empty when there are no relevant lines', async () => {
    const lines = [
      '22:45 InitGame: 10',
    ];
    const result = await collectRoundInfo(lines, 0);
    expect(result).toStrictEqual({"kills": {}, "players": [], "total_kills": 0});
  });

});