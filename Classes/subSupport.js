class Support extends Action {
    constructor(BaseHeal) {
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

  module.exports = subSupport;