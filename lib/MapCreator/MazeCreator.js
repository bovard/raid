var generateMaze = require('generate-maze-by-clustering');

var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapLocation = require('../GameObjects/MapLocation');
var MapUtils = require('../Utils/MapUtils');
var MapOptions = require('./MapOptions');
var TerrainType = require('../GameObjects/TerrainType');


function maze(height, width, mapOptions) {
    var start, exit, map, i, j, x, y, idx;
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

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.GRASS;
    var secondaryOpenTerrain = mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN];

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.TREE;
    var secondaryImpassibleTerrain = mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN];


    exit = new MapLocation(1, 1);
    start = new MapLocation(width - 2, height - 2);

    // how dense the forest is [0,1]
    map = new Map(height, width, start, exit, roundLimit, TerrainType.GRASS);


    var maze = generateMaze([width, height]);
    var matrixLines = maze.toText().split('\n');
    for (j = 0; j < height; j++) {
        var line = matrixLines[j];
        for (i = 0; i < width; i++) {
            var loc = new MapLocation(i, j);
            if (line[i] === "#") {
                if (Math.random() < 0.95 || !secondaryImpassibleTerrain) {
                    map.createTile(loc, primaryImpassibleTerrain);
                } else {
                    map.createTile(loc, secondaryImpassibleTerrain);
                }
            } else {
                if (Math.random() < 0.95 || !secondaryOpenTerrain) {
                    map.createTile(loc, primaryOpenTerrain);
                } else {
                    map.createTile(loc, secondaryOpenTerrain);
                }
            }
        }
    }

    var center = new MapLocation(Math.round(width/2), Math.round(height/2));


    // spawn boss enemies in the middle of the maze
    var spawned = 0;
    if (boss) {
        idx = 0;
        while (idx < 10 && spawned < numBoss) {
            idx++;
            if (MapUtils.spawnInValidLocationInCircle(map, center, 3, boss)) {
                spawned++;
            }
	        if(spawned >= numBoss){
		        break;
	        }
        }
    }

    // spawn primary enemies throughout the maze
    spawned = 0;
    if (primaryEnemy) {
        idx = 0;
        while (idx < 200 && spawned < numPrimaryEnemy) {
            idx++;
            if (MapUtils.spawnInValidLocationInBox(map, map.upperLeft, map.bottomRight, primaryEnemy)) {
                spawned++;
            }
	        if(spawned >= numPrimaryEnemy){
		        break;
	        }
        }
    }


    // spawn secondary enemies in the corners
    spawned = 0;
    var corner;
    if (secondaryEnemy) {
        idx = 0;
        corner = Math.random() < 0.5 ? map.bottomLeft : map.upperRight;
        while (idx < 200 && spawned < numSecondaryEnemy) {
            idx++;
            if (MapUtils.spawnInValidLocationInCircle(map, corner, 3, secondaryEnemy)) {
                spawned++;
            }
	        if(spawned >= numSecondaryEnemy){
		        break;
	        }
        }
    }

    // spawn rareEnemy near exit
    spawned = 0;
    if (secondaryEnemy) {
        idx = 0;
        while (idx < 200 && spawned < numRareEnemy) {
            idx++;
            if (MapUtils.spawnInValidLocationInCircle(map, exit, 3, rareEnemy)) {
                spawned++;
            }
	        if(spawned >= numRareEnemy){
		        break;
	        }
        }
    }

    // spawn swarm enemies in center
    spawned = 0;
    if (swarmEnemy) {
        idx = 0;
        while (idx < 200 && spawned < numSwarmEnemy) {
            idx++;
            if (MapUtils.spawnInValidLocationInCircle(map, center, 3, swarmEnemy)) {
                spawned++;
            }
	        if(spawned >= numSwarmEnemy){
		        break;
	        }
        }
    }

    map.cleanUp(primaryOpenTerrain);

    return map;
}


module.exports = {
    "create": maze
};