import {Action} from './supAction.js'

export class Support extends Action {
    constructor(description, AP_cost, ESS_cost, targets, base_heal, support_type, revive, modifier, aggro) {
      super(description, AP_cost, ESS_cost, targets);
      this.base_heal = base_heal;
      this.support_type = support_type;
      this.revive = revive;
      this.modifier = modifier;
      this.aggro = aggro;
    }
  }