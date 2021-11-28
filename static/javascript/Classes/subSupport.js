import { Action } from "./supAction";

export class Support extends Action {
    constructor(ap, essenceCost, caster, category, revive, targets, targetconditions, BaseHeal) {
      super(ap, essenceCost, caster, category, revive, targets, targetconditions);
      BaseHeal;
      this.Mod = {
          nameMod: [],
          statMod:[],
          valueMod:[],
          durationMod:[]
      };
    }
    Heal(Targets, BaseHeal, MyWill) {
      
    }
    Modify(Targets, Modlist){

    }
    Revive(Targets) {

    }
  }

  module.exports = Support;