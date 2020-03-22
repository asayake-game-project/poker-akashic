export type TexasHoldemAction = "ALLIN" | "RERAISE" | "RAISE" | "CALL" | "CHECK" | "FOLD" | "NONE";
export const ALL_ACTIONS: TexasHoldemAction[] = ["ALLIN", "RAISE", "CALL", "CHECK", "FOLD", "NONE"];
export const ENEMY_ACTIONS: TexasHoldemAction[] = ["RERAISE", "RAISE", "CALL", "NONE"];
