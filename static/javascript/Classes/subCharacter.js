//const supUnit = require('./supUnit');
import {supUnit} from './supUnit.js'

//Player Characters <Extends Unit>
export class Character extends supUnit {

    constructor(char_name, char_desc,str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio){

        super(char_name, char_desc, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio);
        //Variables
        /*
        Evade Pity
        Block Pity
        */
        this.ePity;
        this.bPity;
        
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