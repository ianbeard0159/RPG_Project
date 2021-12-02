//const Character = require('./subCharacter');
import {Character} from './subCharacter.js'
//const Enemy = require('./subEnemy');
import {Enemy} from './subEnemy.js'

export class GameClass {
    constructor() {
        this.characterList = {};
        this.enemyList = {};
    }

    populateCharacters(inCharacters) {
        for (let char in inCharacters) {
            this.characterList[char] = new Character(
                inCharacters[char].char_name,
                inCharacters[char].char_desc,
                inCharacters[char].str,
                inCharacters[char].will,
                inCharacters[char].dex,
                inCharacters[char].foc,
                inCharacters[char].def,
                inCharacters[char].agi,
                inCharacters[char].lvl,
                inCharacters[char].HP_ratio,
                inCharacters[char].ESS_ratio,
                inCharacters[char].AP_ratio
            );
            // The character input should include that character's 
            //     attacks and supports
            if (inCharacters[char].attackList) {
                this.characterList[char].populateAttacks(inCharacters[char].attackList);
            }
            if (inCharacters[char].supportList) {
                this.characterList[char].populateSupports(inCharacters[char].supportList);
            }
        }
    }

    populateEnemys(inEnemys) {
        for (let en in inEnemys) {
            this.enemyList[en] = new Enemy(
                inEnemys[en].str,
                inEnemys[en].will,
                inEnemys[en].dex,
                inEnemys[en].foc,
                inEnemys[en].def,
                inEnemys[en].agi,
                inEnemys[en].lvl,
                inEnemys[en].HP_ratio,
                inEnemys[en].ESS_ratio,
                inEnemys[en].AP_ratio
            );
            // The Enemy input should include that Enemy's 
            //     attacks and supports
            if (inEnemys[en].attackList); {
                this.enemyList[en].populateAttacks(inEnemys[en].attackList);
            }
            if (inEnemys[en].supportList) {
                this.enemyList[en].populateAttacks(inEnemys[en].supportList);
            }
        }
    }
    
}