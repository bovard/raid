var Direction = require('../GameObjects/Direction');
var MapLocation = require('../GameObjects/MapLocation');


function getDirectionFromDiff(diffX, diffY) {
    var scaler = Math.max(Math.abs(diffX), Math.abs(diffY));
    if (scaler === 0) {
        return Direction.OMNI;
    }
    return new Direction(Math.round(diffX/scaler), Math.round(diffY/scaler));
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Expand tiles from a location.
 *
 * @param {MapLocation} location
 * @param {Direction} direction
 * @param {Map} map
 * @param {TerrainType} terrainType
 * @param {Number} sizeX
 * @param {Number} sizeY
 */
function growTilesFromLocation(location, direction, map, terrainType, sizeX, sizeY) {
    var newX = location.x + direction.x * sizeX;
    var newY = location.y + direction.y * sizeY;

    map.createTiles(location, new MapLocation(newX, newY), terrainType);
}

/**
 * Connect two locations together.
 *
 * @param {Array} locations
 * @param {Map} map
 * @param {TerrainType} terrainType
 */
function connectLocations(locations, map, terrainType) {
    var visited = [];
    var current = null;
    var open = [locations[0]];
    var idx = 0;
    do {
        idx++;
        if (idx > 200) {
            break;
        }
        current = open.pop();
        visited.push(current.toString());
        var closest, cDist, dist;
        cDist = 10000;
        for (var i = 0; i < locations.length; i++) {
            if (visited.indexOf(locations[i].toString()) !== -1) {
                continue;
            }
            dist = current.distanceSquaredTo(locations[i]);
            if (dist < cDist) {
                cDist = dist;
                closest = locations[i];
            }
        }
        if (closest) {
            open.push(closest);
            var midPoint = new MapLocation(current.x, closest.y);
            if (Math.random() < .5) {
                midPoint = new MapLocation(closest.x, current.y);
            }
            map.clearArea(current, midPoint, terrainType);
            map.clearArea(midPoint, closest, terrainType);
        }

    } while (visited.length + 1 < locations.length);
}

module.exports = {
    "getDirectionFromDiff": getDirectionFromDiff,
    "getRandomFromRange": getRandomFromRange,
    "growTilesFromLocation": growTilesFromLocation,
    "connectLocations": connectLocations
};