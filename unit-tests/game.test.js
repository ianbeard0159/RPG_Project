import { GameClass } from '../static/javascript/Classes/GameClass.js';
// Test Character Input
const inCharacters = {
    Jason: {
        description: "description",
        strength: 12,
        willpower: 14,
        dexterity: 13,
        focus: 15,
        defense: 10,
        agility: 50,
        char_level: 10,
        health_ratio: 900,
        essence_ratio: 55,
        ap_ratio: 4,
        attackList: {
            "Test Attack": {
                description: "description",
                attack_type: "physical",
                AP_cost: 2,
                ESS_cost: 7,
                accuracy: 70,
                damage_ratio: 60,
                crit_chance: 10,
                targets: 2,
                hits: 1,
                aggro_per_hit: 7
            },
            "Test Attack 2": {
                description: "description",
                attack_type: "electric",
                AP_cost: 4,
                ESS_cost: 10,
                accuracy: 70,
                damage_ratio: 50,
                crit_chance: 10,
                targets: 1,
                hits: 3,
                aggro_per_hit: 7
            }
        },
        supportList: {
            "Test Support": {
                description: "description",
                AP_cost: 2,
                ESS_cost: 7,
                support_type: "heal",
                base_heal: 70,
                revive: 0,
                modifier: 0,
                targets: 2,
                aggro: 7
            }
        }
    },
    Monica: {
        strength: 14,
        willpower: 16,
        dexterity: 15,
        focus: 17,
        defense: 12,
        agility: 15,
        char_level: 12,
        health_ratio: 900,
        essence_ratio: 55,
        AP_ratio: 4,
        attackList: {
            "Test Attack": {
                description: "description",
                attack_type: "physical",
                AP_cost: 2,
                ESS_cost: 7,
                accuracy: 70,
                damage_ratio: 60,
                crit_chance: 10,
                targets: 2,
                hits: 1,
                aggro_per_hit: 7
            },
            "Test Attack 2": {
                description: "description",
                attack_type: "fire",
                AP_cost: 4,
                ESS_cost: 10,
                accuracy: 70,
                damage_ratio: 50,
                crit_chance: 10,
                targets: 1,
                hits: 3,
                aggro_per_hit: 7
            }
        },
        supportList: {
            "Test Support": {
                description: "description",
                AP_cost: 2,
                ESS_cost: 7,
                support_type: "heal",
                base_heal: 70,
                revive: 0,
                modifier: 0,
                targets: 2,
                aggro: 7
            }
        }
    }
}
const inEnemys = {
    "Enemy 1": {
        description: "description",
        strength: 12,
        willpower: 14,
        dexterity: 13,
        focus: 50,
        defense: 10,
        agility: 13,
        enemy_level: 10,
        health_ratio: 900,
        essence_ratio: 55,
        ap_ratio: 4,
        attackList: {
            "Test Attack": {
                description: "description",
                attack_type: "physical",
                AP_cost: 2,
                ESS_cost: 7,
                accuracy: 50,
                damage_ratio: 60,
                crit_chance: 10,
                targets: 3,
                hits: 3,
                aggro_per_hit: 7
            }
        }
    },
    "Enemy 2": {
        description: "description",
        strength: 12,
        willpower: 14,
        dexterity: 13,
        focus: 50,
        defense: 10,
        agility: 13,
        enemy_level: 10,
        health_ratio: 900,
        essence_ratio: 55,
        ap_ratio: 4,
        attackList: {
            "Test Attack": {
                description: "description",
                attack_type: "physical",
                AP_cost: 2,
                ESS_cost: 7,
                accuracy: 50,
                damage_ratio: 60,
                crit_chance: 10,
                targets: 3,
                hits: 3,
                aggro_per_hit: 7
            }
        }
    }
}

// Make a list of character objects
const testGame = new GameClass();
testGame.populateCharacters(inCharacters);
testGame.populateEnemys(inEnemys);

testGame.populateGame();

describe(`Populate Game Object`, function () {
    for (let unit in testGame.turnOrder) {
        test(`Expect ${unit} to be defined in ${testGame.turnOrder[unit]} list`, function () {
            if (testGame.turnOrder[unit] == "enemy") {
                expect(testGame.enemyList[unit]).toBeDefined();
            }
            else if (testGame.turnOrder[unit] == "character") {
                expect(testGame.characterList[unit]).toBeDefined();
            }
        });
    }
});

describe(`Take full round`, function () {
    // For each unit that needs to take a turn
    for (let unit in testGame.turnOrder) {
        // If that unit is an enemy
        if (testGame.turnOrder[unit] == "enemy") {
            describe(`Enemy Turn: ${unit}`, function() {
                let enemy = testGame.enemyList[unit];
                // For each attack that enemy has
                for (let attack in enemy.attackList) {
                    // Use the attack
                    let damageData = enemy.selectAttackTargets(attack);
                    // For each target of the attack
                    for (let char_name in damageData) {
                        for (let entry in damageData[char_name]) {
                            // If sucessful, the attack should return a damage data object
                            test(`Target: ${char_name} - ${attack} - Hit: ${entry}`, function () {
                                expect(damageData[char_name][entry]).toBeDefined();
                            });

                            let char = damageData[char_name][entry];
                            let initialHP = testGame.characterList[char_name].HP_current;
                            let initialTension = testGame.characterList[char_name].tension;
        
                            // The target of the attack should lose health if the attack hit
                            const takeData = testGame.characterList[char_name].takeDamage(char.damage);
        
                            let newTension = testGame.characterList[char_name].tension;
        
                            // The current HP of the character should be the expected value
                            let currentHP = testGame.characterList[char_name].HP_current;
                            test(`-- ${char.result} -> ${takeData.result}: (${initialHP}hp - ${takeData.damage}dmg) = ${currentHP}`, function () {
                                expect(currentHP).toEqual(initialHP - takeData.damage);
                            });
                            // The characters tension should have changed
                            test(`-- Tension: ${initialTension} -> ${newTension} \n`, function () {
                                expect(initialTension).not.toEqual(newTension);
                            });
                            test(`-- Aggro for ${char_name} changed by ${damageData[char_name][entry].aggro}`, function () {
                                // Change the aggro of the enemy towards the target
                                let initialAggro = enemy.changeAggro(char_name, 0);
                                let newAggro = enemy.changeAggro(char_name, 0);
                                if(takeData.damage != 0) {
                                    console.log(takeData.damage);
                                    newAggro = enemy.changeAggro(char_name, (0 - damageData[char_name][entry].aggro));
                                }

                                expect(initialAggro - damageData[char_name][entry].aggro).toEqual(newAggro);
                            });
                        }

                    }
                }
            });
        }
    }
});