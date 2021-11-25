const supUnit = require('./supUnit');
const supAttack = require('./supAction.js');

class Enemy extends supUnit {
    //Vaiables
    /*
    Aggro Table
    */
    constructor(str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio) {
        super(str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio);
        this.aggroTab = [];
    }

    //Methods
    //- TakeDamage(inDamage, Caster)
    //In addition to the normal effects of TakeDamage, increase 
    //the Caster's aggro in Aggro Table

    takeDamgage(inDamage, caster) {
        let totalDam = inDamage - this.def;
        if (totalDam < 0) {
            this.curHealth = this.curHealth - inDamage;
        }
        this.aggroTab[caster] = this.aggroTab[caster] + supAttack.aggro // need to pass in aggro value from attack
    }

    //- PopulateAggro()
    //At the start of battle, add all chracters to the table at 0.

    populateAggro() {
        for (let i = 0; i < 3; i++) {
            this.aggroTab[i] = 0;
        }
    }

    //    - UpdateAggro()
    //Find the lowest value in the table, then subtract 
    //all values in the table by that number, then set the 
    //aggro of any incapacitated characters to 0.

    updateAggro() {
        // Identify the lowest aggro value in the aggro table
        // Skip incapacitated characters
        let lowestAggro = this.aggroTab[0].aggro;
        for (let char in this.aggroTab) {
            if (lowestAggro < this.aggroTable[char].aggro 
                && this.aggroTable[char].affected != 'incapacitated') {
                lowestAggro = this.aggroTable[char].aggro;
            }
        }
        // Subtract the lowest aggro value from every 
        // character's aggro value in the table
        // set incapacitated characters to 0
        for (let char in this.aggroTab) {
            if (this.aggroTable[char].affected != 'incapacitated') {
                this.aggroTab[char].aggro -= lowestAggro;
            }
            // If a character is incapacitated, set their aggro to 0
            else {
                this.aggroTab[char].aggro = 0;
            }
        }
    }

    //SelectTargets(Action)
    //For each target in Action.PotentialTargets: 
    //Choose targets starting with the character who has 
    //the most aggro for the action being performed
    //If multiple characters have the same aggro, or if enemies 
    //are being targeted, then randomly select the target.
    selectedtargets(action) {
        let highestAggro = 0;
        let target;

        for (let i = 0; i < action.potentialTargets.length; i++) {
            this.aggroTab.forEach(character => {
                if (character.aggro > highestAggro) {
                    highestAggro = character.aggro;
                    target = character;
                } 
                else if (character == highestAggro) {
                    if (Math.random() < 0.5) {
                        highestAggro = character.aggro;
                        target = character;
                    }
                }
            });
        }

        //multiple targerts

        return target;
    }
}

module.exports = Enemy;