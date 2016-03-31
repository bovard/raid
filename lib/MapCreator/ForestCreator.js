var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapLocation = require('../GameObjects/MapLocation');
var MapUtils = require('../Utils/MapUtils');
var MapOptions = require('./MapOptions');
var OpenSpaceFinder = require('./OpenSpaceFinder');
var TerrainType = require('../GameObjects/TerrainType');


function forest(height, width, mapOptions) {
    var start, exit, map, i, j, x, y, center;
    var primaryEnemy = mapOptions[MapOptions.PRIMARY_ENEMY];
    var numPrimaryEnemy = mapOptions[MapOptions.NUM_PRIMARY_ENEMIES] || 0;
    var secondaryEnemy = mapOptions[MapOptions.SECONDARY_ENEMY];
    var numSecondaryEnemy = mapOptions[MapOptions.NUM_SECONDARY_ENEMIES] || 0;
    var swarmEnemy = mapOptions[MapOptions.SWARM_ENEMY];
    var numSwarmEnemy = mapOptions[MapOptions.NUM_SWARM_ENEMIES] || 0;
    var rareEnemy = mapOptions[MapOptions.RARE_ENEMY];
    var numRareEnemy = mapOptions[MapOptions.NUM_RARE_ENEMIES] || 0;
    var boss = mapOptions[MapOptions.BOSS_ENEMY];
    var numBoss = mapOptions[MapOptions.NUM_BOSS_ENEMIES] || 0;
    var roundLimit = mapOptions[MapOptions.ROUND_LIMIT] || 1000;
    var fill = mapOptions[MapOptions.TERRAIN_FILL] || 0.5;
    var terrainDensity = mapOptions[MapOptions.TERRAIN_DENSITY] || 0.5;

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.GRASS;
    var secondaryOpenTerrain = mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] || TerrainType.DIRT;

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.TREE;
    var secondaryImpassibleTerrain = mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] || TerrainType.ROCK;

    exit = new MapLocation(0, 0);
    start = new MapLocation(width - 1, height - 1);

    // how dense the forest is [0,1]
    map = new Map(height, width, start, exit, roundLimit, primaryOpenTerrain);


    // spawn the boss at the exit
    if (boss && numBoss > 0) {
        map.addToSpawnList(boss, exit.add(Direction.SOUTH_EAST));
    }

    var centers = MapUtils.createSpacedOutLocations(width, height, fill, 64, start, exit);

    // grow forest randomly around centers
    for (i = 2; i < centers.length; i++) {
        center = centers[i];
        map.createTile(center, primaryImpassibleTerrain);
        for (x = -1; x<=1; x++) {
            for (y = -1; y<=1; y++) {
                if (x === 0 && y=== 0) {
                    continue;
                }
                loc = new MapLocation(center.x + x, center.y + y);
                if (Math.random() < 0.9 * terrainDensity) {
                    map.createTile(loc, primaryImpassibleTerrain);
                }
            }
        }

        for (x = -2; x<=2; x++) {
            for (y = -2; y<=2; y++) {
                if (Math.abs(x) !== 2 && Math.abs(y) !== 2) {
                    continue;
                }
                loc = new MapLocation(center.x + x, center.y + y);
                if (Math.random() < 0.4 * terrainDensity) {
                    map.createTile(loc, primaryImpassibleTerrain);
                }
            }
        }

        for (x = -3; x<=3; x++) {
            for (y = -3; y<=3; y++) {
                if (Math.abs(x) !== 3 && Math.abs(y) !== 3) {
                    continue;
                }
                loc = new MapLocation(center.x + x, center.y + y);
                if (Math.random() < 0.3 * terrainDensity) {
                    map.createTile(loc, primaryImpassibleTerrain);
                }
            }
        }

        for (x = -4; x<=4; x++) {
            for (y = -4; y<=4; y++) {
                if (Math.abs(x) !== 4 && Math.abs(y) !== 4) {
                    continue;
                }
                loc = new MapLocation(center.x + x, center.y + y);
                if (Math.random() < 0.2 * terrainDensity) {
                    map.createTile(loc, secondaryImpassibleTerrain);
                }
            }
        }
    }


    // place enemies
    [
        [primaryEnemy, numPrimaryEnemy],
        [secondaryEnemy, numSecondaryEnemy],
        [rareEnemy, numRareEnemy]
    ].forEach(function (pair) {
        var type = pair[0];
        var count = pair[1];
        if (!type) {
            return;
        }
        idx = 0;
        spawned = 0;
        while (type && idx < 200 && spawned < count) {
            idx++;
            for (i = 2; i < centers.length; i++) {
                center = centers[i];
                if (MapUtils.spawnInValidLocationInCircle(map, center, 3, type)) {
                    spawned++;
                }
	            if(spawned >= count){
		            break;
	            }
            }
        }
    });



    // place swarm
    var circles = OpenSpaceFinder.findOpenSpaces(map);
    spawned = 0;
    idx = 0;
    i = 0;
    while (swarmEnemy && spawned < numSwarmEnemy && idx < 100 && i < circles.length) {
        idx++;
        center = circles[i].center;
        radius = circles[i].radius;
        if (map.getTerrainTypeAtLoc(center) === secondaryOpenTerrain) {
            i++;
            continue;
        }
        r = Math.min(radius, 2);
        for(x = -r; x <= r; x++) {
            for (y = -r; y <= r; y++) {
                loc = new MapLocation(center.x + x, center.y + y);
                if (center.distanceSquaredTo(loc) > r * r) {
                    continue;
                }
                map.createTile(loc, secondaryOpenTerrain);
                if (!map.spawnListContains(loc) && map.isPassable(loc) && spawned < numSwarmEnemy) {
                    if (Math.random() < 0.75) {
                        map.addToSpawnList(swarmEnemy, loc);
                        spawned++;
                    }
                }
            }
        }
        i++;
    }


    return map;
}


module.exports = {
    "create": forest
};