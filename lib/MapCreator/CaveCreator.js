var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapUtils = require('../Utils/MapUtils');
var MapLocation = require('../GameObjects/MapLocation');
var MapOptions = require('./MapOptions');
var TerrainType = require('../GameObjects/TerrainType');

function cave(height, width, mapOptions) {
    var start, exit, map, i, j;
    var primaryEnemy = mapOptions[MapOptions.PRIMARY_ENEMY];
    var secondaryEnemy = mapOptions[MapOptions.SECONDARY_ENEMY];
    var rareEnemy = mapOptions[MapOptions.RARE_ENEMY];
    var boss = mapOptions[MapOptions.BOSS_ENEMY];
    var fill = mapOptions[MapOptions.TERRAIN_FILL] || 1;
    var roundLimit = mapOptions[MapOptions.ROUND_LIMIT] || 1000;

    start = new MapLocation(1, 1);
    exit = new MapLocation(width - 2, height - 2);

    // Approximately the % of open space, must be in [.1,.6]
    map = new Map(height, width, start, exit, roundLimit, TerrainType.ROCK);
    map.fillWithTiles(TerrainType.ROCK);

    // Grow large rooms around the start and exit
    MapUtils.growTilesFromLocation(
        start.add(Direction.NORTH_WEST),
        Direction.SOUTH_EAST,
        map,
        TerrainType.CEMENT,
        MapUtils.getRandomFromRange(5,8),
        MapUtils.getRandomFromRange(5,8),
        true
    );

    MapUtils.growTilesFromLocation(
        exit.add(Direction.SOUTH_EAST),
        Direction.NORTH_WEST,
        map,
        TerrainType.CEMENT,
        MapUtils.getRandomFromRange(5,8),
        MapUtils.getRandomFromRange(5,8),
        true
    );

    MapUtils.connectLocations([start, exit], map, TerrainType.CEMENT);

    // Add creeps
    var creepLoc;
    for (var i = 0; i < 11; i++) {
        creepLoc = new MapLocation(
            MapUtils.getRandomFromRange(0, map.width - 1),
            MapUtils.getRandomFromRange(0, map.height - 1)
        );
        if (map.isMoveSafe(creepLoc)) {
            map.addToSpawnList(primaryEnemy, creepLoc);
        }
    }

    // Spawn the boss at the exit
    if (boss) {
        map.addToSpawnList(boss, exit.add(Direction.NORTH_WEST));
    }

    return map;
}

module.exports = {
    "create": cave
};