const Game = require('../static/javascript/Classes/Game');

test('Is this thing on?', () => {
    expect(true).toBe(true);
});
// Test Character Input
const inCharacters = {
    Jason: {
        str: 12,
        will: 14,
        dex: 13,
        foc: 15,
        def: 10,
        agi: 13,
        lvl: 10,
        HP_ratio: 900,
        ESS_ratio: 55,
        AP_ratio: 4,
        attackList: {
            "Test Attack": {
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
        str: 12,
        will: 14,
        dex: 13,
        foc: 5,
        def: 10,
        agi: 13,
        lvl: 10,
        HP_ratio: 900,
        ESS_ratio: 55,
        AP_ratio: 4,
        attackList: {
            "Test Attack": {
                AP_cost: 2,
                ESS_cost: 7,
                accuracy: 25,
                damage_ratio: 60,
                crit_chance: 10,
                targets: 2,
                hits: 1,
                aggro_per_hit: 7
            }
        }
    }
}
// Test Enemy Input

// Make a list of character objects
const testGame = new Game();
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
            testGame.characterList[char].takeDamage(testCases[i].inDamage);
            const tempHP = testGame.characterList[char].HP_current;
            const tempStatus  = testGame.characterList[char].state.status;
            
            test(`${i}) inDamage = ${testCases[i].inDamage}`, function () {
                // Run Test
                if (HP_initial - testCases[i].inDamage > 0) {
                    expect(tempHP).toEqual(HP_initial - testCases[i].inDamage);
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
        }
    });

    //
    // Enemy Attacks Player
    //
    for (let en in testGame.enemyList) {
        describe(`Testing ${en} Attack`, function () {

            // Test Populate aggro
            testGame.enemyList[en].populateAggro(testGame.characterList);
            const indexZero = testGame.enemyList[en].aggroTab[0];
            // Perform the test
            test(`Testing ${en} populate aggro`, function () {
                expect(indexZero).toBeDefined();
            });
        });

        // Test select targets
        describe(`Testing ${en} select targets`, function () {
            // Find the first attack available to the enemy
            let keys = Object.keys(testGame.enemyList[en].attackList);
            let firstAttack = keys[0];

            let damageData = testGame.enemyList[en].selectAttackTargets(firstAttack);
            console.log(damageData);
            test(`target should exist in the characters list`, function () {
                expect(testGame.characterList[damageData.target]).toBeDefined();
            });

            // Damage should be applied to the target's health
            let initialHP = testGame.characterList[damageData.target].HP_current;
            testGame.characterList[damageData.target].takeDamage(damageData.damage);

            test(`Character should lose health if the attack hit`, function () {
                if (damageData.result != "Miss") {
                    expect(initialHP).not.toEqual(testGame.characterList[damageData.target].HP_current);
                }
                else{
                    expect(initialHP).toEqual(testGame.characterList[damageData.target].HP_current);
                }
            })
        });
    }
}

