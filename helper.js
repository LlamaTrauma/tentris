var allPieces = [];

var size = 11;
while(size > 10){
    size = prompt("Enter a piece size (1-10)\n10 may take a few seconds to compute.");
}
var linesCleared = 0;

function rotateAroundPoint(px, py, ax, ay, dir){
    var toReturn = [px - ax, py - ay];
    for(var i = 0; i < dir % 4; i ++){
        toReturn = [-toReturn[1], toReturn[0]];
    }
    return [toReturn[0] + ax, toReturn[1] + ay];
}

function drawPieces(pieces){
    const size2 = 20;
    const side = size2 * (size + 1);
    const perLine = Math.floor(500 / side);
    ctx.fillStyle = "rgb(0, 0, 200)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    var cnt = 0;
    for(var i = 0; i < pieces.length; i ++){
        //console.log("drawing piece " + (++cnt));
        var x = i % perLine * side + 2 + side / 2;
        var y = Math.floor(i / perLine) * side + 2 + side / 2; 
        for(var j = 0; j < pieces[i].length; j ++){
            for(var k = 0; k < pieces[i][j].length; k ++){
                if(pieces[i][j][k] == 1){
                    ctx.fillRect(x + k * size2, y + j * size2, size2, size2);
                }
            }
        }
    }
}

function findTiles(){
    function tilesEqual(a, b){
        if(!((a.length == b.length && a[0].length == b[0].length) || (a.length == b[0].length && a[0].length == b.length))){  
            return false;
        }
        var identicalCopy = true;
        var rot180 = true;
        if(a.length != b.length){
            rot180 = false;
            identicalCopy = false;
        }
        var rot90 = true;
        var rot270 = true;
        if(!(a.length == b[0].length)){
            rot90 = false;
            rot270 = false;
        }    
        for(var i = 0; i < a.length; i ++){
            for(var j = 0; j < a[i].length; j ++){
                if(a.length == b.length){
                    if(identicalCopy && a[i][j] != b[i][j]){
                        identicalCopy = false;
                    }
                    if(rot180 && a[i][j] != b[b.length - 1 - i][b[i].length - 1 - j]){
                        rot180 = false;
                    }
                }
                if(a.length == b[0].length){
                    if(rot90 && a[i][j] != b[j][a.length - 1 - i]){
                        rot90 = false;
                    }
                    if(rot270 && a[i][j] != b[a[0].length - 1 - j][i]){
                        rot270 = false;
                    }
                }
                if(!(identicalCopy || rot180 || rot90 || rot270)){
                    i = a.length;
                    return;
                }
            }
        }
        if(identicalCopy || rot180 || rot90 || rot270){
            return true;
        }
        return false;
    }
    var tiles = [[[[1]]], [[[1, 1]]]];
    for(var i = 2; i < size; i ++){
        tiles.push([]);
        var initial = "";
        for(var j = 0; j < tiles[i - 1].length; j ++){
            for(var k = 0; k < tiles[i - 1][j].length; k ++){
                for(var l = 0; l < tiles[i - 1][j][k].length; l ++){
                    if(tiles[i - 1][j][k][l] == 1){
                        for(var m = -1; m < 2; m ++){
                            for(var n = -1; n < 2; n ++){
                                if(m != n && m + n != 0 && (k + m < 0 || k + m == tiles[i - 1][j].length || l + n < 0 || l + n ==  tiles[i - 1][j][k + m].length || tiles[i - 1][j][k + m][l + n] == 0)){
                                    var newTile = [];
                                    for(var o = 0; o < tiles[i - 1][j].length; o ++){
                                        newTile.push(tiles[i - 1][j][o].map((x) => x));
                                    }
                                    var xdiff = 0;
                                    var ydiff = 0;
                                    if(l + n < 0){
                                        for(var p = 0; p < newTile.length; p ++){
                                            newTile[p].unshift(0);
                                        }
                                        xdiff = 1;
                                    } else if(l + n > tiles[i - 1][j][0].length - 1) {
                                        for(var p = 0; p < newTile.length; p ++){
                                            newTile[p].push(0);
                                        }
                                    }
                                    var addy = [];
                                    for(var p = 0; p < newTile[0].length; p ++){
                                        addy.push(0);
                                    }
                                    if(k + m < 0){
                                        newTile.unshift(addy);
                                        ydiff = 1;
                                    } else if(k + m > tiles[i - 1][j].length - 1) {
                                        newTile.push(addy);
                                    }
                                    newTile[k + m + ydiff][l + n + xdiff] = 1;
                                    var o = 0;
                                    for(o = 0; o < tiles[i].length; o ++){
                                        if(tilesEqual(tiles[i][o], newTile)){
                                            o = tiles[i].length + 1;
                                            break;
                                        }
                                    }
                                    if(o < tiles[i].length + 1){
                                        tiles[i].push(newTile);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /*var returnTiles = [];
    for(var i = 0; i < tiles[size - 1].length; i ++){
        returnTiles.push([]);
        for(var j = 0; j < tiles[size - 1][i].length; j ++){
            for(var k = 0; k < tiles[size - 1][i][j].length; k ++){
                if(tiles[size - 1][i][j][k] == 1){
                    returnTiles[returnTiles.length - 1].push([k, j]);
                }
            }
        }
    }*/
    return tiles[size - 1];
}

function containsArray(container, containee){
    for(var i = 0; i < container.length; i ++){
        similar = true;
        for(var j = 0; j < containee.length; j ++){
            if(containee[j] != container[i][j]){
                similar = false;
                break;
            }
        }
        if(similar)
            return true;
    }
    return false;
}

/*function findRotations(tiles){
    var allPaths = [];
    var path = [[0, 0]];
    var sides = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    var choices = [3, 0, 0]
    var pathIndex = 0;
    var effectiveLength = 1;
    var revisited = [];
    function removeTile(){
        path.pop();
        pathIndex -= 1;
        if(revisited[pathIndex].length > 0){
            revisited[pathIndex].pop();
        } else {
            effectiveLength -= 1;
        }
    }
    while(1){
        console.log(pathIndex);
        if(choices[pathIndex] < 4){
            while(pathIndex > choices.length - 1){
                choices.push(0);
            }
            while(pathIndex > revisited.length - 1){
                revisited.push([]);
            }
            var toAppend = [path[path.length - 1][0] + sides[choices[pathIndex]][0], path[path.length - 1][1] + sides[choices[pathIndex]][1]];
            if(!containsArray(revisited[pathIndex], toAppend)){
                if(!containsArray(path, toAppend)){
                    effectiveLength += 1;
                    revisited[pathIndex] = [];
                } else {
                    revisited[pathIndex].push(toAppend.map((x)=>x));
                }
                path.push(toAppend.map((x)=>x));
            }
            choices[pathIndex] += 1;
            pathIndex += 1;
            if(effectiveLength >= tiles){
                //Make a copy so it's not pushing a reference
                allPaths.push(path.map((x) => x));
                removeTile();
            } else if(pathIndex > tiles * 2){
                console.log("pathIndex too high");
                choices[pathIndex] = 0;
                removeTile();
            }
        } else {
            choices[pathIndex] = 0;
            removeTile();
            if(path.length == 1){
                break;
            }
        }
    }
    return allPaths;
}*/