
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserDumb');
var HealthFullCheck = require('./Behaviors/HealthFullCheck');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function GenericMeleePlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveCloser(this.cc);
    var health = new HealthFullCheck(this.cc);

    //if the health is full, we're not going to do anything else, otherwise we're going to destroy the player.
    this.behaviors = [health, melee, move];
}

GenericMeleePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = GenericMeleePlayer;