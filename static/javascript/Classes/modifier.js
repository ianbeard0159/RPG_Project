export class modifier {
    constructor( description, ap, essenceCost, caster, category, revive, targets, targetconditions) {
      
      this.description = description;
      this.AP = ap;
      this.essenceCost = essenceCost;
      this.caster = caster;
      this.category = category;
      this.revive = revive;
      this.targets = targets;
      this.targetconditions = targetconditions;
    }
    SpendResources() {
      
    }
    FindTargets() {
        
    }
    PopulateTargets() {
      
    }
  }

  module.exports = modifier;