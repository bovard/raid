var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapUtils = require('../Utils/MapUtils');
var MapLocation = require('../GameObjects/MapLocation');
var MapOptions = require('./MapOptions');
var TerrainType = require('../GameObjects/TerrainType');

function cave(height, width, mapOptions) {
    var start, exit, map, i, j, x, y;
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

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.CEMENT;
    var secondaryOpenTerrain = mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] || TerrainType.DIRT;

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.ROCK;
    var secondaryImpassibleTerrain = mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] || TerrainType.WATER;

    start = new MapLocation(width - 2, 1);
    exit = new MapLocation(1, height - 2);

    map = new Map(height, width, start, exit, roundLimit, primaryImpassibleTerrain);
    map.fillWithTiles(primaryImpassibleTerrain);

    // create a few rooms
    var centers = MapUtils.createSpacedOutLocations(width, height, fill, 64, start, exit);

    // grow clearings around each room
    var center;
    var circles = [];
    centers.forEach(function(center) {
        MapUtils.createClearingAroundLocation(map, center, 2, 4, primaryOpenTerrain);
        circles.push({
            "center": center,
            "radius": 2
        });
    });

    MapUtils.drunkConnectLocationList(map, centers, 1, primaryOpenTerrain, {drunkness: 0.5});

    var startCircle = 2;
    var circle, spawned;
    var radius, r;
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
                if(map.isOnMap(loc) && map.isPassable(loc) && spawned < numSwarmEnemy && !map.spawnListContains(loc)) {
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


    // Add pools of water
    for (i = 2; i < centers.length; i++) {
        center = centers[i];
        if (Math.random() < 0.5) {
            if (!map.spawnListContains(center)) {
                map.createTile(center, TerrainType.WATER);
            }
            if (Math.random() < 0.75) {
                if (!map.spawnListContains(center.add(Direction.EAST))) {
                    map.createTile(center.add(Direction.EAST), secondaryImpassibleTerrain);
                }
                if (Math.random() < 0.33) {
                    if (!map.spawnListContains(center.add(Direction.SOUTH_EAST))) {
                        map.createTile(center.add(Direction.SOUTH_EAST), secondaryImpassibleTerrain);
                    }
                    if (!map.spawnListContains(center.add(Direction.SOUTH))) {
                        map.createTile(center.add(Direction.SOUTH), secondaryImpassibleTerrain);
                    }
                }
            }
        }
    }

    // Spawn the boss at the exit
    if (boss && numBoss > 0) {
        map.addToSpawnList(boss, exit.add(Direction.SOUTH_WEST));
    }

    return map;
}

module.exports = {
    "create": cave
};