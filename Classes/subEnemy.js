const supUnit = require ('./supUnit');

class Enemy extends supUnit {
//Vaiables
/*
Aggro Table
*/
    constructor(){
        this.aggroTab = []

        super(str, will, dex, foc, def, agi)

        //Methods
    //- TakeDamage(inDamage, Caster)
	//In addition to the normal effects of TakeDamage, increase 
    //the Caster's aggro in Aggro Table

        function takeDamgage(inDamge, caster) {
            totalDam = inDamage - this.def;
			if(totalDam < 0 ){
			this.curHealth = this.curHealth - inDamage;
			};
            this.aggroTab[caster] = this.aggroTab[caster] + aggro // need to pass in aggro value from attack
        }

        

    //- PopulateAggro()
    //At the start of battle, add all chracters to the table at 0.

        function populateAggro(){
            for (let i = 0; i < 3; i++){
            this.aggroTab[i] = 0;
            }
        }

    //    - UpdateAggro()
	//Find the lowest value in the table, then subtract 
    //all values in the table by that number, then set the 
    //aggro of any incapacitated characters to 0.

    function updateAggro(){
        for(let i = 0; i < aggroTab.length; i++){
            let lowestAggro = 100;
            this.aggroTab.forEach(character=> {
                if(character < lowestAggro){
                lowestAggro = character;
                }
            });
        }

        if(character.affected == 'incapacitated'){
            this.aggroTab[character.id] = 0;
        }
    }

    //SelectTargets(Action)
	//For each target in Action.PotentialTargets: 
    //Choose targets starting with the character who has 
    //the most aggro for the action being performed
	//If multiple characters have the same aggro, or if enemies 
    //are being targeted, then randomly select the target.
    function selectedtargets(action) {

        for(let i = 0; i < aggroTab.length; i++){
            let highestAggro = 0;
            this.aggroTab.forEach(character=> {
                if(character > highestAggro){
                highestAggro = character;
            } if(character == highestAggro){
                if(Math.random() < 0.5){
                    highestAggro = character
                }
            }
            });
        }

        //multiple targerts

        return highestAggro;
    }

    }
}

module.exports = Enemy;