import { FLUSH_SITUATION, STRAIGHT_SITUATION, SAME_CARDS, NONE } from '../../../const/game/learn/BoardType';
import { RankUtil } from '../RankUtil';
import { CardModel } from '../../../model/game/CardModel';

export class BoardUtil {
  static getBoardType(board: CardModel[]): number {
    return BoardUtil.getStraightSituation(board) + BoardUtil.getFlushSituation(board) + BoardUtil.getSameCardSituation(board);
  }

  static getStraightSituation(board: CardModel[]): number {
    return RankUtil.isStraightDraw(board) ? STRAIGHT_SITUATION : NONE;
  }

  static getFlushSituation(board: CardModel[]): number {
    return (RankUtil.getFlushRanks(board, 3).length > 0) ? FLUSH_SITUATION : NONE;
  }

  static getSameCardSituation(board: CardModel[]): number {
    if (RankUtil.getThreeCardRank(board) !== null) {
      return SAME_CARDS;
    } else if (RankUtil.getPairRank(board) !== null) {
      return SAME_CARDS;
    }
    return NONE;
  }

  // 現在のボード状態を判定するための即席的なやつ
  static isMatch(boardType: number, targetType: number): boolean {
    const digit = String(targetType).length;
    const board = boardType % (10*(digit+1));
    return board - targetType >= 0;
  }
}