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
                inCharacters[char].description,
                inCharacters[char].strength,
                inCharacters[char].willpower,
                inCharacters[char].dexterity,
                inCharacters[char].focus,
                inCharacters[char].defense,
                inCharacters[char].agility,
                inCharacters[char].char_level,
                inCharacters[char].health_ratio,
                inCharacters[char].essence_ratio,
                inCharacters[char].ap_ratio
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
                inEnemys[en].description,
                inEnemys[en].strength,
                inEnemys[en].willpower,
                inEnemys[en].dexterity,
                inEnemys[en].focus,
                inEnemys[en].defense,
                inEnemys[en].agility,
                inEnemys[en].enemy_level,
                inEnemys[en].health_ratio,
                inEnemys[en].essence_ratio,
                inEnemys[en].ap_ratio
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

//attackbtn.addEventListener("click", runAttack , false)