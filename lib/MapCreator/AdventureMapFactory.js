var Map = require('../Map');
var UnitType = require('../UnitType');
var MapOptions = require('./MapOptions');

var ForestCreator = require('./ForestCreator');
var SewerCreator = require('./SewerCreator');
var CaveCreator = require('./CaveCreator');

function AdventureMapFactory() {

}

function createLegalMap(mapCreationFunction, height, width, primaryEnemy, secondaryEnemy, rareEnemy, boss, options) {
    var i = 0;
    do {
        map = mapCreationFunction(height, width, primaryEnemy, secondaryEnemy, rareEnemy, boss, options);
        i++;
    } while (!map.isLegal() && i < 10);
    if (i == 10) {
        throw Error("Error generating legal map!");
    }
    return map;
}

// static functions
AdventureMapFactory.createAdventureMap = function(level) {
    var mapOptions;
    switch(level) {
        case 1:
            mapOptions = {};
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.SWARM_ENEMY] = UnitType.GNAT;
            mapOptions[MapOptions.TERRAIN_FILL] = .3;
            mapOptions[MapOptions.TERRAIN_DENSITY] = .25;
            return createLegalMap(ForestCreator.create, 21, 31, mapOptions);
        case 2:
            mapOptions = {};
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.SWARM_ENEMY] = UnitType.GNAT;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.TERRAIN_FILL] = .4;
            mapOptions[MapOptions.TERRAIN_DENSITY] = .5;
            return createLegalMap(ForestCreator.create, 21, 31, mapOptions);
        case 3:
            mapOptions = {};
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.SWARM_ENEMY] = UnitType.GNAT;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.RARE_ENEMY] = UnitType.QUILL_BOAR;
            mapOptions[MapOptions.TERRAIN_FILL] = .5;
            mapOptions[MapOptions.TERRAIN_DENSITY] = .75;
            return createLegalMap(ForestCreator.create, 26, 51, mapOptions);
        case 4:
            mapOptions = {};
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.SWARM_ENEMY] = UnitType.GNAT;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.RARE_ENEMY] = UnitType.QUILL_BOAR;
            mapOptions[MapOptions.BOSS_ENEMY] = UnitType.NECROMANCER;
            mapOptions[MapOptions.TERRAIN_FILL] = .5;
            mapOptions[MapOptions.TERRAIN_DENSITY] = .75;
            return createLegalMap(ForestCreator.create, 26, 51, mapOptions);
        case 5:
            mapOptions = {};
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.TERRAIN_FILL] = .5;
            return createLegalMap(SewerCreator.create, 26, 51, mapOptions);
        case 6:
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.GIANT_FROG;
            mapOptions[MapOptions.TERRAIN_FILL] = .5;
            return createLegalMap(SewerCreator.create, 26, 51, mapOptions);
        case 7:
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.SKELETON;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.SKELETON;
            mapOptions[MapOptions.TERRAIN_FILL] = .3;
            return createLegalMap(SewerCreator.create, 26, 51, mapOptions);
        case 8:
            mapOptions[MapOptions.PRIMARY_ENEMY] = UnitType.SKELETON;
            mapOptions[MapOptions.SECONDARY_ENEMY] = UnitType.SKELETON;
            mapOptions[MapOptions.RARE_ENEMY] = UnitType.NECROMANCER;
            mapOptions[MapOptions.BOSS_ENEMY] = UnitType.NECROMANCER;
            mapOptions[MapOptions.TERRAIN_FILL] = .3;
            return createLegalMap(SewerCreator.create, 26, 51, mapOptions);
        default:
            throw Error("no adventure level "+ level);
    }
};

module.exports = AdventureMapFactory;