//const supUnit = require('./supUnit');
import {supUnit} from './supUnit.js'

//Player Characters <Extends Unit>
export class Character extends supUnit {

    constructor(description, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio){

        super(description, str, will, dex, foc, def, agi, lvl, hpRatio, essRatio, apRatio);
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
    selectAttackTargets(action, targetList) {
        return this.performAttack(action, targetList);
    }
}