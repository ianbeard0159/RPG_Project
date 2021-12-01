//import { supUnit } from "./supUnit";
const supUnit = require ("./supUnit");
//Player Characters <Extends Unit>
class Character extends supUnit {

    constructor(ePit, bPit, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio){

        super(str, will, dex, foc, 
              def, agi, lvl, hpRatio, 
              essRatio, apRatio);
        //Variables
        /*
        Evade Pity
        Block Pity
        */
        this.ePity = ePit;
        this.bPity = bPit;
        
    }

    //Methods
    /*
    SelectTargets(Action)
        Take Player Input to select targets from Action.
        PotentialTargets for the action being performed
    */
    selectTargets(action, selectedTarget) {
        let targeted;
        action.potentialTagets.forEach(target => {
            let accepted = false;
            if (target == selectedTarget) {
                accepted = true;
                targeted = target;
            } if (!accepted) {
                console.log('invaild target')
                return
            }
            return targeted;
        });
    }
}

module.exports = Character;