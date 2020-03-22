import { TexasHoldemAction } from '../../const/game/TexasHoldemAction';

export class ActionModel {
  name: TexasHoldemAction;
  value: number;

  constructor(name: TexasHoldemAction , value: number) {
    this.name = name;
    this.value = value;
  }

  getActionNameForEnemy(myActionName: TexasHoldemAction): TexasHoldemAction {
    let actionName: TexasHoldemAction  = this.name;
    if (actionName === "ALLIN") {
      actionName = "RAISE";
    }
    if (actionName === "FOLD") {
      return "NONE";
    } else if (actionName === "CHECK") {
      return "CALL";
    } else if (myActionName === "RAISE" && actionName === "RAISE") {
      return "RERAISE";
    }
    return actionName;
  }
}
