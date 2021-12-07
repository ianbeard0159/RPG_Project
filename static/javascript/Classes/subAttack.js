import {Action} from './supAction.js'

export class Attack extends Action {
    constructor(description, attack_type, AP_cost, ESS_cost, accuracy, damage_ratio, crit_chance, targets, hits, aggro_per_hit) {
        super(description, AP_cost, ESS_cost, targets);

        this.attack_type = attack_type;
        this.accuracy = accuracy;
        this.crit_chance = crit_chance;
        this.damage_ratio = damage_ratio;
        this.hits = hits;
        this.aggro_per_hit = aggro_per_hit;
    }
    hit(target, aimStat, myTension) {
        // hitChance should be a positive integer between 1 and 99
        let hitChance = Math.ceil(this.accuracy + (aimStat*myTension) - (target.char_agi*target.char_tension));
        if (hitChance > 99) {
            hitChance = 99;
        }
        const rollA = Math.floor(Math.random()*100);
        const rollB = Math.floor(Math.random()*100);

        // console.log(`Hit Chance: ${hitChance} (${rollA})(${rollB})`);

        if (hitChance >= rollA && hitChance >= rollB) {
            return 1.1;
        }
        else if (hitChance >= rollA || hitChance >= rollB) {
            return 1.0;
        }
        else {
            return 0;
        }
    }

    crit() {
        const roll = Math.floor(Math.random()*100);
        if (this.crit_chance >= roll) {
            return 2;
        }
        else {
            return 1;
        }
    }

    dealDamage(attackStat, aimStat, dmgMods, target, tension, lvl) {
        const didHit = this.hit(target, aimStat, tension)
        const didCrit = this.crit();

        // console.log(`${didHit} * ${didCrit} * sqrt( ${attackStat} / ${target.char_def} ) * ${this.damage_ratio * lvl / 2}`)

        let baseDamage = Math.round(didHit*didCrit*(Math.sqrt(attackStat/target.char_def)*(this.damage_ratio * lvl / 2)));

        for (let mod in dmgMods) {
            baseDamage += Math.round(baseDamage * mod.effect);
        }

        return { damage: baseDamage, crit: didCrit, aggro: this.aggro_per_hit};
    }

  }