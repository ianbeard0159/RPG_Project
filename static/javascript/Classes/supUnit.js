const Modifier = require ('./modifier');
const Attack = require('./subAttack');
const Support = require('./subSupport');

//Super Unit class that will give heritage to Character and Enemy
class supUnit {

    constructor(str, will, dex, foc, def, agi, lvl, ratio_HP, ratio_ESS, ratio_AP){
		// Stats
        this.str = str;
		this.will = will;
		this.dex = dex;
		this.foc = foc;
		this.def = def;
		this.agi = agi;
		this.lvl = lvl;
		this.evasion = this.agi / 2;
		this.block = this.def / 2;

		// Modifers 
		this.modifiers = [];
		// Actions
		this.attacks = [];
		this.supports = [];

		// Resources
		this.HP_max = ratio_HP * Math.round(Math.sqrt(lvl));
		this.HP_current;
		this.AP_max = ratio_AP * Math.round(Math.sqrt(lvl));
		this.AP_current;
		this.ESS_max = ratio_ESS * Math.round(Math.sqrt(lvl));
		this.ESS_current;
		this.tension;

		// effects
		this.resistances = {};
		this.state = {}; 
	}

	// Take input from API request to assign actions to the character
	populateAttacks(inAttacks) {
		for (let att in inAttacks) {
			this.attacks.push(new Attack(att.attack_name /*Attack parameters*/));
		}
	}
	populateSupports(inSupports) {
		for (let sup in inSupports) {
			this.supports.push(new Support(sup.sup_name /*Support parameters*/));

			// If the support has modifiers attached to it, assign 
			//    those modifiers here
		}
	}

	addModifier(inMod) {
		this.modifiers.push(new Modifier(inMod.name, inMod.stat, inMod.effect, inMod.duration));
	}

	//Run This.SelectTargets(), then perform one of the unit's available actions.
	performAttack(att, targets) {
		// Make the player select a different action if they don't have enough AP
		if (this.AP_current - att.cost_AP < 0) {
			return "not enough ap";
		}
		// Apply essence burn if the generate too much essence
		let ESS_total = this.ESS_current + att.ESS_cost;
		if (ESS_total > this.ESS_max) {
			this.ESS_current = this.ESS_max;
			let ESS_diff = ESS_total - this.ESS_max;
			this.essenceBurn(ESS_diff);
		}
		// Attack each target
		for (let target in targets) {
			let attackStat;
			let aimStat;
			let dmgMods = [];
			// Use Strength and Dexterity for physical attacks
			if (att.type == "physical") {
				attackStat = this.str;
				aimStat = this.dex;
				// Apply any relevant modifiers
				for (let mod in this.modifiers) {
					if (this.modifiers[mod.stat] == "strength") {
						attackStat += this.str * this.modifiers[mod.effect];
					}
					else if (this.modifiers[mod].stat == "dexterity") {
						aimStat += this.dex * this.modifiers[mod.effect]; 
					}
					else if (this.modifiers[mod].stat == att.type) {
						dmgMods += this.modifiers[mod].effect;
					}
				}
			}
			// Else, assume the attack is magical
			//    (The attack may have sub types 
			//     such as 'electric' in the future)
			else {
				attackStat = this.will;
				aimStat = this.foc;
				// Apply any relevant modifiers
				for (let mod in this.modifiers) {
					if (this.modifiers[mod].stat == "willpower") {
						attackStat += this.will * this.modifiers[mod.effect];
					}
					else if (this.modifiers[mod].stat == "focus") {
						aimStat += this.foc * this.modifiers[mod.effect]; 
					}
					else if (this.modifiers[mod].stat == att.type) {
						dmgMods += this.modifiers[mod].effect;
					}
				}
			}
			att.dealDamage(attackStat, aimStat, dmgMods, target);
		}


	}
	//Reduces damage from attack based on defense, resistances, evasion chance, and block chance. Then reduces CurrentHealth by the remaining number. 
	takeDamage(inDamage) {
		let totalDamage = inDamage;
		if (this.resistances) {
			// Each resistance will be a positive or negative
			//   precentage, written in decimal form
			for (let res in this.resistances) {
				totalDamage -= inDamage * res;
			}
		}
		this.HP_current -= totalDamage;
		this.checkHealth();
	}

	// Essence will build up from spell casts, which will damage character
	essenceBurn(difference) {
		this.takeDamage(this.HP_current - difference * 25);
	}

	// Change the unit's status if necessary
	checkHealth() {
		if(this.HP_current <= 0) {
			this.state = 'Incapacitated';
		}
		if (this.HP_current > 0 && this.state == 'Incapacitated'){
			this.state = 'Active';
		}
	}
	//Call ChangeDuration, and removes any with a duration <= 0.
	checkModifiers() {
		for (let mod in this.modifiers) {
			// Subtract the duration of each modifier in each mod list by 1
			this.modifiers[mod].changeDuration(-1);
			// If that particular modifier has a duration of 0, 
			//    remove it from it's mod list
			//    (A duration of -1 represents
			//     a permanent modifier)
			if (this.modifiers[mod].duration == 0) {
				this.modifiers.splice(mod, 1);
			}
		}
	}

	//If ap is lower than lowest action ap cost, end turn.
	checkAP() {
		// Find the action with the lowest AP cost
		let lowestAP = 20;
		for (let act in this.actions) {
			if (this.actions[act].apCost < lowestAP) {
				lowestAP = this.actions[act].apCost;
			}
		}
		// End the unit's turn if they don't have enough AP to do anything
		if(this.AP_current < lowestAP) {
			return "end turn";
		}
		return null;
	}

}



module.exports = supUnit;