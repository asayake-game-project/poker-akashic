import { MachineState } from './MachineState';
import { ALL_REAL_RANK_STRENGTH_FOR_MIDSTREAM } from '../../../const/game/RankStrength';
import { ALL_BOARD_PATTERNS } from '../../../const/game/learn/BoardType';
import { TexasHoldemAction, ENEMY_ACTIONS } from '../../../const/game/TexasHoldemAction';
import { RankUtil } from '../../../util/game/RankUtil';
import { BoardUtil } from '../../../util/game/learn/BoardUtil';
import { CardModel } from '../CardModel';

export default class MachineOpenedBoardState implements MachineState {
  readonly id: number;
  rank: number;
  usedHandsCount: number;
  isFlushDraw: boolean;
  isStraightDraw: boolean;
  boardType: number;
  enemyAction: TexasHoldemAction;

  constructor(id: number, rank: number, usedHandsCount: number, isFlushDraw: boolean, isStraightDraw: boolean, boardType: number, enemyAction: TexasHoldemAction) {
    this.id = id;
    this.rank = rank;
    this.usedHandsCount = usedHandsCount;
    this.isFlushDraw = isFlushDraw;
    this.isStraightDraw = isStraightDraw;
    this.boardType = boardType;
    this.enemyAction = enemyAction;
  }

  static generateAllStates(): MachineOpenedBoardState[] {
    let states = [],
      id = 1;
    for (let rank of ALL_REAL_RANK_STRENGTH_FOR_MIDSTREAM) {
      for (let boardType of ALL_BOARD_PATTERNS) {
        for (let used = 0; used <= 2; used++) {
          for (let enemyAction of ENEMY_ACTIONS) {
            states.push(new MachineOpenedBoardState(id, rank, used, true, true, boardType, enemyAction));
            states.push(new MachineOpenedBoardState(id + 1, rank, used, true, false, boardType, enemyAction));
            states.push(new MachineOpenedBoardState(id + 2, rank, used, false, true, boardType, enemyAction));
            states.push(new MachineOpenedBoardState(id + 3, rank, used, false, false, boardType, enemyAction));
            id += 4;
          }
        }
      }
    }
    return states;
  }

  static getId(myHand: CardModel[], boardCards: CardModel[], enemyAction: TexasHoldemAction): number {
    let rank = RankUtil.getRank(myHand, boardCards),
      usedHandsCount = RankUtil.getUsedHandsCount(rank, myHand, boardCards),
      isFlushDraw = RankUtil.isFlushDraw(myHand, boardCards),
      isStraightDraw = RankUtil.isStraightDraw(myHand.concat(boardCards), 4),
      boardType = BoardUtil.getBoardType(boardCards),
      searched = ALL_STATES.filter((state) => {
        return rank.strength === state.rank && usedHandsCount === state.usedHandsCount && isFlushDraw === state.isFlushDraw && isStraightDraw === state.isStraightDraw && boardType === state.boardType && enemyAction === state.enemyAction;
      });
    if (searched.length === 0) {
      throw new Error('状態IDが見つかりませんでした');
    }
    return searched[0].id;
  }

  // 対象の状態に似たような状態の取得
  static getSimilarIds(myHand: CardModel[], boardCards: CardModel[], enemyAction: TexasHoldemAction): number[] {
    let rank = RankUtil.getRank(myHand, boardCards),
      usedHandsCount = RankUtil.getUsedHandsCount(rank, myHand, boardCards),
      boardType = BoardUtil.getBoardType(boardCards),
      searched = ALL_STATES.filter((state) => {
        return rank.strength - 0.2 <= state.rank && state.rank <= rank.strength + 0.2 && usedHandsCount === state.usedHandsCount && boardType === state.boardType && enemyAction === state.enemyAction;
      });
    if (searched.length === 0) {
      throw new Error('状態IDが見つかりませんでした');
    }
    return searched.map(state => state.id);
  }

  static getStatesCount(): number {
    return ALL_STATES.length;
  }
}

const ALL_STATES = MachineOpenedBoardState.generateAllStates();
