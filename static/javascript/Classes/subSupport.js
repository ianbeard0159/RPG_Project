const Action = require('./supAction.js');

class subSupport extends Action {
    constructor(AP_cost, ESS_cost, targets, base_heal, support_type, revive, modifier, aggro) {
      super(AP_cost, ESS_cost, targets);
      this.base_heal = base_heal;
      this.support_type = support_type;
      this.revive = revive;
      this.modifier = modifier;
      this.aggro = aggro;
    }
  }

  module.exports = subSupport;