var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapLocation = require('../GameObjects/MapLocation');
var MapOptions = require('./MapOptions');
var MapUtils = require('../Utils/MapUtils');
var OpenSpaceFinder = require('./OpenSpaceFinder');
var TerrainType = require('../GameObjects/TerrainType');

function walk(height, width, mapOptions) {
    var start, exit, map, i, j, x, y, loc, connectWidth, type;
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

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.GRASS;
    var secondaryOpenTerrain = mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] || TerrainType.DIRT;

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.ROCK;
    var secondaryImpassibleTerrain = mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] || TerrainType.TREE;

    start = new MapLocation(1, 1);
    exit = new MapLocation(width - 2, height - 2);
    // approximately the % of open space, must be in [.1,.6]
    map = new Map(height, width, start, exit, roundLimit, primaryImpassibleTerrain);

    for (i = 0; i < 5 + Math.random() * 2; i++) {
        type = Math.random();
        connectWidth = 1 + Math.round(Math.random());
        if (Math.random() < 0.7) {
            MapUtils.connectLocationsDrunkWalk(map, start, exit, connectWidth, primaryOpenTerrain, {});
        } else {
            MapUtils.connectLocationsCurve(map, start, exit, connectWidth, primaryOpenTerrain, {});
        }
    }

    for (i = 0; i < 5 + Math.random() * 2; i++) {
        type = Math.random();
        connectWidth = 1 + Math.round(Math.random() * 2);
        if (Math.random() < 0.7) {
            MapUtils.connectLocationsDrunkWalk(map, map.bottomLeft, map.upperRight, connectWidth, primaryOpenTerrain, {});
        } else {
            MapUtils.connectLocationsCurve(map, map.bottomLeft, map.upperRight, connectWidth, primaryOpenTerrain, {});
        }
    }

    var circles = OpenSpaceFinder.findOpenSpaces(map);

    var startCircle = 0;
    var circle, spawned;
    var center, radius, r;
    var idx = 0;
    spawned = 0;
    while (swarmEnemy && spawned < numSwarmEnemy && idx < 100 && startCircle < circles.length) {
        idx++;
        circle = circles[startCircle];
        center = circle.center;
        radius = circle.radius;

        startCircle++;
        r = Math.min(radius, 2);
        for (x = -r; x <= r; x++) {
            for (y = -r; y<= r; y++) {
                loc = new MapLocation(center.x + x, center.y + y);
                if (loc.distanceSquaredTo(center) > r * r) {
                    continue;
                }
                map.createTile(loc, secondaryOpenTerrain);
                if(map.isPassable(loc) && spawned < numSwarmEnemy && !map.spawnListContains(loc)) {
                    if (Math.random() < 0.75) {
                        map.addToSpawnList(swarmEnemy, loc);
                        spawned++;
                    }
                }
            }
        }

    }

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
            for (i = startCircle; i < circles.length; i++) {
                circle = circles[i];
                if (MapUtils.spawnInValidLocationInCircle(map, circle.center, circle.radius, type)) {
                    spawned++;
                }
	            if(spawned >= count){
		            break;
	            }
            }
        }
    });

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            loc = new MapLocation(x, y);
            if (map.isOnMap(loc) && !loc.equals(start) && !loc.equals(exit)) {
                if (!map.spawnListContains(loc)) {
                    if (Math.random() < 0.1 && secondaryImpassibleTerrain) {
                        map.createTile(loc, secondaryImpassibleTerrain);
                    }
                }
            }
        }
    }

    // spawn the boss at the exit
    if (boss && numBoss > 0) {
        map.createTile(exit.add(Direction.NORTH_EAST), primaryOpenTerrain);
        map.addToSpawnList(boss, exit.add(Direction.NORTH_WEST));
    }

    return map;
}

module.exports = {
    "create": walk
};