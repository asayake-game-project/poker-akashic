import { MachineState } from './MachineState';
import { TexasHoldemAction, ENEMY_ACTIONS } from '../../../const/game/TexasHoldemAction';
import { CardModel } from '../CardModel';

export interface CardPair {
  top: number;
  bottom: number;
}

export class MachinePreFlopState implements MachineState {
  readonly id: number;
  handTop: number;
  handBottom: number;
  isSuited: boolean;
  enemyAction: TexasHoldemAction;

  constructor(id: number, handTop: number, handBottom: number, isSuited: boolean, enemyAction: TexasHoldemAction) {
    this.id = id;
    this.handTop = handTop;
    this.handBottom = handBottom;
    this.isSuited = isSuited;
    this.enemyAction = enemyAction;
  }

  static generateAllStates(): MachinePreFlopState[] {
    let states: MachinePreFlopState[] = [],
      cardPairs: CardPair[] = [],
      id: number = 1;
    for (let topNum = 14; topNum >= 2; topNum--) {
      for (let bottomNum = topNum; bottomNum >= 2; bottomNum--) {
        cardPairs.push({top:topNum, bottom:bottomNum});
      }
    }
    cardPairs.forEach((pair) => {
      for (let enemyAction of ENEMY_ACTIONS) {
        states.push(new MachinePreFlopState(id, pair.top, pair.bottom, true, enemyAction));
        states.push(new MachinePreFlopState(id + 1, pair.top, pair.bottom, false, enemyAction));
        id += 2;
      }
    });
    return states;
  }

  static getId(myHand: CardModel[], enemyAction: TexasHoldemAction): number {
    let sortedMyHand = myHand.sort((card1, card2) => card1.number - card2.number),
      isSuited = sortedMyHand[0].suit === sortedMyHand[1].suit,
      searched = PRE_FLOP_STATES.filter((state) => {
        return sortedMyHand[0].number === state.handBottom && sortedMyHand[1].number === state.handTop && isSuited === state.isSuited && enemyAction === state.enemyAction;
      });
    if (searched.length === 0) {
      throw new Error('状態IDが見つかりませんでした');
    }
    return searched[0].id;
  }

  // 対象の状態に似たような状態の取得
  static getSimilarIds(myHand: CardModel[], enemyAction: TexasHoldemAction): number[] {
    let sortedMyHand = myHand.sort((card1, card2) => card1.number - card2.number),
      isPocketHand = sortedMyHand[0].number === sortedMyHand[1].number,
      searched = PRE_FLOP_STATES.filter((state) => {
        return sortedMyHand[0].number - 1 <= state.handBottom && state.handBottom <= sortedMyHand[0].number + 1 && sortedMyHand[1].number - 1 <= state.handTop && state.handTop <= sortedMyHand[1].number + 1 && isPocketHand === (state.handBottom === state.handTop) && enemyAction === state.enemyAction;
      });
    if (searched.length === 0) {
      throw new Error('状態IDが見つかりませんでした');
    }
    return searched.map(state => state.id);
  }

  static getStatesCount(): number {
    return PRE_FLOP_STATES.length;
  }

  static getState(stateId: number): MachinePreFlopState {
    const targetState = PRE_FLOP_STATES.filter(state => state.id === stateId);
    return targetState[0];
  }
}

const PRE_FLOP_STATES: MachinePreFlopState[] = MachinePreFlopState.generateAllStates();
