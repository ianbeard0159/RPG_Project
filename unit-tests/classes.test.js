import { GameClass } from '../static/javascript/Classes/GameClass.js';

test('Is this thing on?', () => {
    expect(true).toBe(true);
});
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
    }
}
// Test Enemy Input

// Make a list of character objects
const testGame = new GameClass();
testGame.populateCharacters(inCharacters);
testGame.populateEnemys(inEnemys);

let testCases;

// Run unit tests on every character in the character list
for (let char in testGame.characterList) {
    //
    // Test Unit.TakeDamage;
    //
    describe(`Test ${char}.takeDamage`, function () {
        // Set up test cases
        testCases = [{inDamage: 10}, {inDamage: testGame.characterList[char].HP_max + 1}];
        for (let i in testCases) {
            const HP_initial = testGame.characterList[char].HP_current;
            // Run takeDamage
            const takeData = testGame.characterList[char].takeDamage(testCases[i].inDamage);
            const tempHP = testGame.characterList[char].HP_current;
            const tempStatus  = testGame.characterList[char].state.status;
            
            test(`${i}) ${tempHP} should be ${HP_initial } - ${takeData.damage} = ${HP_initial - takeData.damage}`, function () {
                // Run Test
                if (HP_initial - takeData.damage > 0) {
                    expect(tempHP).toEqual(HP_initial - takeData.damage);
                    expect(tempStatus).toEqual("Active");
                }
                else {
                    expect(tempHP).toEqual(0);
                    expect(tempStatus).toEqual("Incapacitated");
                }
            });
            // Reset current HP
            testGame.characterList[char].HP_current = testGame.characterList[char].HP_max;
            testGame.characterList[char].state.status = "Active";
            testGame.characterList[char].tension = 1;
        }
    });
}
    //
    // Enemy Attacks Player
    //
    for (let en in testGame.enemyList) {
        describe(`Testing ${en} Attack`, function () {

            // Test Populate aggro
            testGame.enemyList[en].populateAggro(testGame.characterList);
            const indexZero = testGame.enemyList[en].aggroTab[0];
            // Perform the test
            test(`Testing ${en} populate aggro \n`, function () {
                expect(indexZero).toBeDefined();
            });
        });

        // Test select targets
        describe(`Testing ${en} Attack`, function () {
            // Find the first attack available to the enemy
            let keys = Object.keys(testGame.enemyList[en].attackList);
            let firstAttack = keys[0];

            // The attack should generate damage data against valid targets
            let damageData = testGame.enemyList[en].selectAttackTargets(firstAttack);

            for (let char_name in damageData) {
                for (let entry in damageData[char_name]) {
                    // If sucessful, the attack should return a damage data object
                    test(`Target: ${char_name} - ${firstAttack} - Hit: ${entry} -- Damage Data should exist`, function () {
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
                    test(`-- ${char.result} -> ${takeData.result}: (${initialHP}hp - ${takeData.damage}dmg) -- ${currentHP}hp should be ${initialHP - takeData.damage}hp`, function () {
                        expect(currentHP).toEqual(initialHP - takeData.damage);
                    });
                    // The characters tension should have changed
                    test(`-- Tension: ${initialTension} -> ${newTension} -- Should  be different \n`, function () {
                        expect(initialTension).not.toEqual(newTension);
                    });
                    // The aggro that the target has accumulated towards the target should be updated
                    /*
                    test(`-- Aggro for ${char_name} changed by ${takeData.change}`, function () {
                        let index = testGame.enemyList[en].aggroTab.filter(function (aggroEntry) {
                            return
                        });
                    });
                    */
                }
            }
        });
    
}

