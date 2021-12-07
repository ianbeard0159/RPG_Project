import {Attack} from './subAttack.js'
import {Support} from './subSupport.js'

//Super Unit class that will give heritage to Character and Enemy
export class supUnit {

    constructor(description, str, will, dex, foc, def, agi, lvl, ratio_HP, ratio_ESS, ratio_AP){
		
		this.description = description;
		
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
		this.attackList = {};
		this.supportList = {};

		// Resources
		this.HP_max = ratio_HP * Math.round(Math.sqrt(lvl));
		this.HP_current = this.HP_max;
		this.AP_max = ratio_AP * Math.round(Math.sqrt(lvl));
		this.AP_current = 0; 
		this.ESS_max = ratio_ESS * Math.round(Math.sqrt(lvl));
		this.ESS_current = this.ESS_max;
		this.tension = 1;

		// effects
		this.resistances = {};
		this.state = {
			status: "Active"
		}; 
	}
	startTurn() {
		this.AP_current += this.AP_max;
	}

	// Take input from API request to assign actions to the character
	populateAttacks(inAttacks) {
		for (let att in inAttacks) {
			this.attackList[att] = new Attack(
				inAttacks[att].description,
				inAttacks[att].attack_type,
				inAttacks[att].ap_cost,
				inAttacks[att].essence_cost,
				inAttacks[att].accuracy,
				inAttacks[att].dammage_ratio,
				inAttacks[att].crit_chance,
				inAttacks[att].targets,
				inAttacks[att].hits,
				inAttacks[att].aggro_per_hit
			);
		}
	}
	populateSupports(inSupports) {
		for (let sup in inSupports) {
			this.supportList[sup] = new Support(
				inSupports[sup].description,
				inSupports[sup].AP_cost,
				inSupports[sup].ESS_cost,
				inSupports[sup].targets,
				inSupports[sup].base_heal,
				inSupports[sup].support_type,
				inSupports[sup].revive,
				inSupports[sup].modifier,
				inSupports[sup].aggro,
			);

			// If the support has modifiers attached to it, assign 
			//    those modifiers here
		}
	}
	spenResources(ap, essence) {
		this.AP_current -= ap;
		this.ESS_current -= essence;
		if (this.ESS_current < 0) this.ESS_current = 0;
	}
/*
	addModifier(inMod) {
		this.modifiers.push(new Modifier(inMod.name, inMod.stat, inMod.effect, inMod.duration));
	}
*/
	//Run This.SelectTargets(), then perform one of the unit's available actions.
	performAttack(att, targets) {
		// Make the player select a different action if they don't have enough AP
		if (this.AP_current - this.attackList[att].AP_cost < 0) {
			console.log('oops');
			return "not enough ap";
		}
		// Apply essence burn if the generate too much essence
		let ESS_total = this.ESS_current - this.attackList[att].ESS_cost;
		if (ESS_total < 0) {
			this.ESS_current = 0;
			let ESS_diff = ESS_total / this.ESS_max;
			console.log(ESS_diff);
			this.essenceBurn(ESS_diff);
		}
		this.spenResources(this.attackList[att].AP_cost, this.attackList[att].ESS_cost);
		// Attack each target
		let returnData = {};
		for (let target in targets) {
			let attackStat;
			let aimStat;
			let dmgMods = [];
			// Use Strength and Dexterity for physical attacks
			if (this.attackList[att].attack_type == "physical") {
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
			let targetData = {};
			for (let hit = 0; hit < this.attackList[att].hits; hit++) {
				let damageData = this.attackList[att].dealDamage(attackStat, aimStat, dmgMods, targets[target], this.tension, this.lvl);
				let returnStr = "Hit";
				console.log(this.attackList[att])
				console.log(damageData.damage);

				if (damageData.damage == 0) {
					returnStr = "Miss";
				}
				else if (damageData.crit == 2) {
					returnStr = "Crit";
				}
				targetData[hit] = {
						damage: damageData.damage,
						result: returnStr,
						aggro: damageData.aggro
				};
			}
			// Add the target's damage data to the result object
			if(!returnData[targets[target].char_name]) {
				returnData[targets[target].char_name] = targetData;
			}
			// If an entry for that character already exists, add one with a new name
			else {
				let index = Object.keys(returnData[targets[target].char_name]).length;
				for (let i in targetData) {
					returnData[targets[target].char_name][i + index] = targetData[i];
				}
			}
		}

		return returnData;
	}
	// Change the unit's tension, min 0.5, max 1.5
	changeTension(change) {
		let newTension = Math.round((this.tension + change) * 100) /100;
		// Enforce min/max
		if (newTension > 1.5) {
			newTension = 1.5;
		}
		if (newTension < 0.5) {
			newTension = 0.5;
		}
		// Set tension and return the value
		if (this.state.status != "Incapacitated") this.tension = newTension;
		return this.tension;
	}
	//Reduces damage from attack based on defense, resistances, evasion chance, and block chance. Then reduces CurrentHealth by the remaining number. 
	takeDamage(inDamage) {
		let totalDamage = inDamage;
		console.log(totalDamage)
		if (this.resistances) {
			// Each resistance will be a positive or negative
			//   precentage, written in decimal form
			for (let res in this.resistances) {
				totalDamage -= inDamage * res;
			}
		}
		// Try to block or evade 
		const percentHP = totalDamage / this.HP_max;
		let result = "miss";
		let changeMultiplier = -10;
		let rollA = Math.floor(Math.random()*100);
		let rollB = Math.floor(Math.random()*100);
		let totalEvasion = this.evasion;
		for (let mod in this.modifiers) {
			if (this.modifiers[mod].stat == "evasion")
			totalEvasion += this.evasion * this.modifiers[mod].effect;
		}
		// Evades if either roll is below totalEvasion
		if (totalDamage != 0) {
			if (totalEvasion > rollA || totalEvasion > rollB) {
				totalDamage = 0;
				result = "evaded";
				changeMultiplier = 10;
			}
			else {
				rollA = Math.floor(Math.random()*100);
				rollB = Math.floor(Math.random()*100);
				let totalBlock = this.block;
				for (let mod in this.modifiers) {
					if (this.modifiers[mod].stat == "block")
					totalBlock += this.block * this.modifiers[mod].effect;
				}
				// Blocks is both rolls are below totalBlock
				if (totalBlock > rollA && totalBlock > rollB) {
					totalDamage = 0;
					result = "blocked";
					changeMultiplier = 10;
				}
				// Partially blocks if only one roll is below totalBlock
				else if (totalBlock > rollA || totalBlock > rollB) {
					totalDamage = Math.round(totalDamage / 2);
					result = "partially blocked";
					changeMultiplier = -10;
				}
				else {
					result = "taken";
					changeMultiplier = -10;
				}
			}
		}
		let change = Math.ceil(((percentHP / changeMultiplier)) * 100) / 100;
		// Lower Tension based on damage
		if (result == "miss" || totalDamage != 0) {
			change -= 0.01;
		}
		const tensionChange = this.changeTension(change);

		// Lower health based on damage
		this.HP_current -= totalDamage;
		this.checkHealth();
		const takeData = {
			damage: totalDamage,
			tension: tensionChange,
			result: result,
			change: change
		}

		return takeData;
	}

	// Essence will build up from spell casts, which will damage character
	essenceBurn(difference) {
		this.takeDamage(this.HP_current - difference * 25);
	}

	// Change the unit's status if necessary
	checkHealth() {
		if(this.HP_current <= 0) {
			this.HP_current = 0;
			this.state.status = 'Incapacitated';
			this.tension = 0.5;
		}
		if (this.HP_current > 0 && this.state == 'Incapacitated'){
			this.state.status = 'Active';
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