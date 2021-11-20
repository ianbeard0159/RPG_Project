//Super Unit class that will give heritage to Character and Enemy
class supUnit {

    constructor(str, will, dex, foc, def, agi){
		// Stats
        this.str = str,
		this.will = will,
		this.dex = dex,
		this.foc = foc,
		this.def = def,
		this.agi = agi,

		// Modifers 
		strMod = [,],
		willMod = [,],
		dexMod = [,],
		focMod = [,],
		defMod = [,],
		agiMod = [,],

		// In game stats
		maxHeatlh,
		curHealth,
		maxAP,
		curAP,
		maxEss,
		curEss,
		tes,

		// effects
		actions = [{}],
		resists = {},
		damageBon = {},
		evaChance = {},
		evaMod = {},
		blockChance = {},
		blockMod = {},
		affected = {} //status is restricted, the characted is affected with this/ese

		//Run This.SelectTargets(), then perform one of the unit's available actions.
		function performAction(action, targets) {
			let potTarg = this.SelectTargerts();
			action(potTarg);
		}
		//Reduces damage from attack based on defense, resistances, evasion chance, and block chance. Then reduces CurrentHealth by the remaining number. 
		function takeDamage(inDamage) {
			totalDam = inDamage - this.def;
			if(totalDam < 0 ){
			this.curHealth = this.curHealth - inDamage;
			};
		}

		// Essence will build up from spell casts, which will damage character
		function essenceburn(difference) {
			this.curHealth - difference;
		}

		function checkHealth() {
			if(this.curHealth <= 0) {
				affected = 'Incapacitated';
			}
			if (curHealth > 0 && affected == 'Incapacitated'){
				affected = 'active';
			}
		}
		//Call ChangeDuration, and removes any with a duration <= 0.
		function checkModifiers() {
			changeDuration(strMod);
			changeDuration(willMod);
			changeDuration(dexMod);
			changeDuration(focMod);
			changeDuration(defMod);
			changeDuration(agiMod);
			if(strMod[1] == 0){
				strMod[0] = 0;
			}
			if(willMod[1] == 0){
				willMod[0] = 0;
			}
			if(dexMod[1] == 0){
				dexMod[0] = 0;
			}
			if(focMod[1] == 0){
				focMod[0] = 0;
			}
			if(defMod[1] == 0){
				defMod[0] = 0;
			}
			if(agiMod[1] == 0){
				agiMod[0] = 0;
			}
		}

		//If ap is lower than lowest action ap cost, end turn.
		function checkAP() {
			let lowestAP = 20;
			actions.forEach(action => {
				if(action.apCost < lowestAP)
				lowestAP = action.apCost;
			});
			if(curAP < lowestAP) {
				endTurn();
			}
		}

    }

}
