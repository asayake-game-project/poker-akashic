import { CardModel } from './CardModel';
import { ActionModel } from './ActionModel';
import { RankUtil } from '../../util/game/RankUtil';
import { Position } from '../../const/game/Position';
import { CharacterData } from '../data/CharacterData';
import { TexasHoldemAction } from '../../const/game/TexasHoldemAction';
import { RankModel } from './RankModel';

export class PlayerModel {
  readonly id: number;
  protected initialStack: number;
  protected seatNumber: number;
  protected stack: number;
  protected hand: CardModel[];
  protected action: ActionModel | null;
  protected position: Position;
  protected characterData: CharacterData;

  constructor(id: number, money: number, seatNumber: number, characterData: CharacterData) {
    this.id = id;
    this.initialStack = money;
    this.seatNumber = seatNumber;
    this.stack = money;
    this.hand = [];
    this.action = null;
    this.position = Position.OTHER;
    this.characterData = new CharacterData(characterData);
  }

  setAction(name: TexasHoldemAction, value: number): void {
    this.action = new ActionModel(name, value);
  }

  getAction(): ActionModel {
    return this.action;
  }

  resetAction(): void {
    this.action = null;
  }

  getBetValue(): number {
    return this.action !== null ? this.action.value : 0;
  }

  pay(value: number): void {
    this.stack -= value;
  }

  addStack(value: number): void {
    this.stack += value;
  }

  getStack(): number {
    return this.stack;
  }

  setStack(money: number): void {
    this.stack = money;
  }

  hasHand(): boolean {
    return this.hand.length > 0
  }

  hasChip(): boolean {
    return this.stack > 0;
  }

  isActive(): boolean {
    return this.hasHand() && this.hasChip();
  }

  getCards(): CardModel[] {
    return this.hand;
  }

  setCards(cards: CardModel[]): void {
    this.hand = cards;
  }

  dumpCards(): void {
    this.hand = [];
  }

  getRank(openedCards: CardModel[]): RankModel {
    return RankUtil.getRank(this.hand, openedCards);
  }

  getPosition(): Position {
    return this.position;
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  getSeatNumber(): number {
    return this.seatNumber;
  }

  setSeatNumber(index: number): void {
    this.seatNumber = index;
  }

  getInitialStack(): number {
    return this.initialStack;
  }

  changeInitialiStack(stack: number): void {
    this.initialStack = stack;
  }

  setDisplayName(name: string): void {
    this.characterData.displayName = name;
  }

  resetAll(): void {
    this.stack = this.initialStack;
    this.hand = [];
    this.action = null;
    this.position = Position.OTHER;
  }
}
