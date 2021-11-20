//Player Characters <Extends Unit>
class Character extends Unit {

constructor(ePit, bPit){
//Variables
/*
Evade Pity
Block Pity
*/
this.ePity = ePit,
this.bPity = bPit,

function selectingTargets(action){
    
}

super(str, will, dex, foc, def, agi)

//Methods
/*
SelectTargets(Action)
	Take Player Input to select targets from Action.
    PotentialTargets for the action being performed
*/
function selectTargets(action, selectedTarget) {
    let possibleTargets = action.potentialTagets
    let targeted;
    possibleTargets.forEach(target => {
        let accepted = false;
        if(target = selectedTarget){
            accepted = true;
            targeted = target;
        } if(!accepted) {
            console.log('invaild target')
            return
        }
        return targeted;
    });
}
}
}