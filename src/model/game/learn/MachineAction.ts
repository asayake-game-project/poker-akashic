import { TexasHoldemAction }  from '../../../const/game/TexasHoldemAction';
import { MachineActionNum } from "../../../const/game/learn/MachineActionNum";

export const enum BetStrength {
  WEAK = -1,
  MEDIUM = 0,
  STRONG = 1
}

export default class MachineAction {
  readonly id: number;
  readonly actionName: TexasHoldemAction;
  readonly strength: BetStrength;
  constructor(id: MachineActionNum, actionName: TexasHoldemAction, strength: BetStrength = 0) {
    this.id = id;
    this.actionName = actionName;
    this.strength = strength;
  }

  static generateAllActions(): MachineAction[] {
    const actions = [];
    actions.push(new MachineAction(MachineActionNum.BIG_RAISE, "RAISE", BetStrength.STRONG));
    actions.push(new MachineAction(MachineActionNum.MIDDLE_RAISE, "RAISE", BetStrength.MEDIUM));
    actions.push(new MachineAction(MachineActionNum.SMALL_RAISE, "RAISE", BetStrength.WEAK));
    actions.push(new MachineAction(MachineActionNum.CALL, "CALL"));
    actions.push(new MachineAction(MachineActionNum.CHECK, "CHECK"));
    actions.push(new MachineAction(MachineActionNum.FOLD, "FOLD"));
    return actions;
  }

  static getMachineAction(id: MachineActionNum): MachineAction {
      let selected = ALL_MACHINE_ACTIONS.filter(action => id === action.id);
      return selected[0];
  }

  static getActionsCount(): number {
    return ALL_MACHINE_ACTIONS.length;
  }
}

const ALL_MACHINE_ACTIONS = MachineAction.generateAllActions();
