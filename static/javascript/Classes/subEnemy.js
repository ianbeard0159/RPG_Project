import {supUnit} from './supUnit.js'

export class Enemy extends supUnit {
    //Vaiables
    /*
    Aggro Table
    */
    constructor(description, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio) {
        super(description, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio);
        this.aggroTab = [];
    }

    //- PopulateAggro()
    //At the start of battle, add all chracters to the table at 0.

    populateAggro(characterList) {
        for (let char in characterList) {
            this.aggroTab.push({
                char_name: char,
                char_def: characterList[char].def,
                char_agi: characterList[char].agi,
                char_tension: characterList[char].tension,
                char_status: characterList[char].state.status,
                aggro: 0
            });
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
                && this.aggroTable[char].char_status != 'incapacitated') {
                lowestAggro = this.aggroTable[char].aggro;
            }
        }
        // Subtract the lowest aggro value from every 
        // character's aggro value in the table
        // set incapacitated characters to 0
        for (let char in this.aggroTab) {
            if (this.aggroTable[char].char_status != 'incapacitated') {
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
    selectTargets(action) {
        let targetList = [];
        // Make a temporary aggro table that entries can 
        //    be removed from as needed
        let tempTable = this.aggroTab;
        // Make a table for any equal entries

        // Select a target from the table for each available target
        for (let i = 0; i < this.attackList[action].targets; i++) {
            let equalAggro = [];
            // Stop selecting targets if there are no more targets to select
            if (tempTable.length == 0) break;

            let highestAggro = 0;
            // Make sure that the array has a spot for the new entry
            targetList.push('');
            for (let char in tempTable) {
                // Remove all entries from equalAggro
                if (tempTable[char].char_status != "Incapacitated") {
                    if (tempTable[char].aggro > highestAggro) {
                        // Make an initial value for equalAggro
                        //    (this block will only run if there
                        //     aren't any equal entries yet)
                        equalAggro = [ tempTable[char] ];
                    }
                    // Create a list of targets who have equal aggro
                    else if (tempTable[char].aggro == highestAggro) {
                        equalAggro.push(tempTable[char]);
                    }
                }
            }
            // If there is more than one entry in the equalAggro list
            //    Randomly choose one to be the target
            //    and remove that character from the temp table
            if(equalAggro.length > 1) {
                let j = Math.floor(Math.random() * equalAggro.length);
                targetList[i] = equalAggro[j];
            }
            else {
                targetList[i] = equalAggro[0];
            }
            let index = tempTable.indexOf(targetList[i]);
            tempTable.splice(index, 1);
        }
        return targetList;

    }
    selectAttackTargets(action) {
        let targets = this.selectTargets(action);
        return this.performAttack(action, targets);
    }
    selectSupportTargets(action) {
        let targets = this.selectTargets(action);
        this.performSupport(action, targets);
    }
}