export interface Game {
  id: string;
  name: string;
  shortName?: string;
  logoText: string;
}

export const games: Game[] = [
  { id: "pubg-mobile", name: "PUBG Mobile", logoText: "PUBG MOBILE" },
  { id: "chess", name: "Chess", logoText: "CHESS" },
  { id: "cs2", name: "Counter-Strike 2", logoText: "COUNTER STRIKE 2" },
  { id: "pubg", name: "PUBG Battlegrounds", logoText: "PUBG BATTLEGROUNDS" },
  { id: "dota2", name: "Dota 2", logoText: "DOTA 2" },
  { id: "fc26", name: "EA Sports FC 26", logoText: "FC26" },
  { id: "hok", name: "Honor of Kings", logoText: "HONOR OF KINGS" },
  { id: "r6", name: "Rainbow Six Siege", logoText: "R6 SIEGE" },
  { id: "valorant", name: "Valorant", logoText: "VALORANT" },
  { id: "mlbb", name: "Mobile Legends: Bang Bang", logoText: "MOBILE LEGENDS" },
  { id: "apex", name: "Apex Legends", logoText: "APEX LEGENDS" },
];
