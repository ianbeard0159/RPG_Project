import { Action } from "./supAction";

export class Attack extends Action {
    constructor(acc, crit, damratio, hits, attr) {
        super();
        this.acc = acc;
        this.crit = crit;
        this.damratio = damratio;
        this.hits = hits;
        this.attr = attr;
    }
    Attack(Hits, Targets) {
      
    }
    Damage(Hits, CriticalChance, MyWill, DamageRatio){

    }
    Hit(Accuracy, MyFocus, MyTension, TargetAligity) {

    }
    Crit(CriticalChance){

    }

  }

  module.exports = Attack;