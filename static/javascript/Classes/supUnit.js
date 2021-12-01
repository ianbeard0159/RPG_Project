const modifier = require ('./modifier');
const game = this.require('./game');

//Super Unit class that will give heritage to Character and Enemy
class supUnit {

    constructor(str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio){
		// Stats
        this.str = str;
		this.will = will;
		this.dex = dex;
		this.foc = foc;
		this.def = def;
		this.agi = agi;
		this.lvl = lvl;

		// Modifers 
		this.mods = {
			strMod: [],
			willMod: [],
			dexMod: [],
			focMod: [],
			defMod: [],
			agiMod: []
		};

		// In game stats
		this.maxHeatlh = hpRatio * Math.round(Math.sqrt(lvl));
		this.curHealth;
		this.maxAP = apRatio * Math.round(Math.sqrt(lvl));
		this.curAP;
		this.maxEss = essRatio * Math.round(Math.sqrt(lvl));
		this.curEss;
		this.tension;

		// effects
		this.actions = [{}];
		this.resists = {};
		this.damageBon = {};
		this.evaChance = {};
		this.evaMod = {};
		this.blockChance = {};
		this.blockMod = {};
		this.affected = {}; //status is restricted, the characted is affected with this/ese
	}


	//Run This.SelectTargets(), then perform one of the unit's available actions.
	performAction(action, potTarg) {
		let targets = this.SelectTargerts(potTarg);
		action(targets);
	}
	//Reduces damage from attack based on defense, resistances, evasion chance, and block chance. Then reduces CurrentHealth by the remaining number. 
	takeDamage(inDamage) {
		let totalDam = inDamage - this.def;
		if(totalDam < 0 ){
			this.curHealth = this.curHealth - inDamage;
		}
	}

	// Essence will build up from spell casts, which will damage character
	essenceburn(difference) {
		this.curHealth - difference;
	}

	checkHealth() {
		if(this.curHealth <= 0) {
			this.affected = 'Incapacitated';
		}
		if (this.curHealth > 0 && this.affected == 'Incapacitated'){
			this.affected = 'active';
		}
	}
	//Call ChangeDuration, and removes any with a duration <= 0.
	checkModifiers() {
		for (let modList in this.modifiers) {
			for(let mod in modList) {
				// Subtract the duration of each modifier in each mod list by 1
				modifier.changeDuration(modList[mod]);
				// If that particular modifier has a duration of 0, remove it from it's mod list
				if (modList[mod].duration == 0) {
					delete modList[mod];
				}
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
		if(this.curAP < lowestAP) {
			game.endTurn();
		}
	}

}

module.exports = supUnit;