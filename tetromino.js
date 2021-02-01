class Piece{
    constructor(tiles, width, height, x, y, color){
        this.tiles = tiles;
        this.gamewidth = width;
        this.gameheight = height;
        this.x = x || Math.ceil((this.gamewidth - tiles[0].length)  / 2);
        if(x == 0){
            this.x = x;
        }
        this.y = y || 0;
        this.color = color || "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        this.width = this.tiles[0].length;
        this.height = this.tiles.length;
        this.onBoard = false;
        this.rotations = [];
        this.rotationOffsets = [];
        this.timesRotated = 0;
        for(var i = 0; i < 4; i ++){
            this.rotations.push([]);
            this.rotationOffsets.push([]);
            for(var j = 0; j < 2; j ++){
                this.rotationOffsets[i].push(Math.max(this.width, this.height));
            }
            if(i % 2 == 1){
                for(var j = 0; j < this.width; j ++){
                    this.rotations[i].push([]);
                    for(var k = 0; k < this.height; k ++){
                        this.rotations[i][j].push(0);
                    }
                }
            } else {
                for(var j = 0; j < this.height; j ++){
                    this.rotations[i].push([]);
                    for(var k = 0; k < this.width; k ++){
                        this.rotations[i][j].push(0);
                    }
                }
            }
            var newPositions = [];
            for(var j = 0; j < this.height; j ++){
                for(var k = 0; k < this.width; k ++){
                    if(this.tiles[j][k] == 1){
                        var newPosition = rotateAroundPoint(k, j, (this.width - 1) / 2, (this.height - 1) / 2, i);
                        newPositions.push(newPosition);
                        //console.log(newPosition);
                        this.rotationOffsets[i][0] = Math.min(newPosition[0], this.rotationOffsets[i][0]);
                        this.rotationOffsets[i][1] = Math.min(newPosition[1], this.rotationOffsets[i][1]);
                    }
                }
            }
            console.log("rot: " + i);
            console.log("width: " + this.width);
            console.log("height: " + this.height);
            for(var j = 0; j < newPositions.length; j ++){
                console.log("y: " + (newPositions[j][1] - this.rotationOffsets[i][1]) * 2 / 2);
                console.log("x: " + (newPositions[j][0] - this.rotationOffsets[i][0]) * 2 / 2);
                this.rotations[i][newPositions[j][1] - this.rotationOffsets[i][1]][newPositions[j][0] - this.rotationOffsets[i][0]] = 1;
            }
        }
        for(var i = 0; i < this.rotationOffsets.length; i ++){
            this.rotationOffsets[i][0] = Math.floor(this.rotationOffsets[i][0]);
            this.rotationOffsets[i][1] = Math.floor(this.rotationOffsets[i][1]);
        }
    }

    draw (ctx, scale){
        ctx.fillStyle = this.color;
        for(var i = 0; i < this.height; i ++){
            for(var j = 0; j < this.width; j ++){
                if(this.tiles[i][j] == 1){
                    ctx.fillRect((this.x + j) * scale, (this.y + i) * scale, scale, scale);
                }
            }
        }
    }

    drawAt(ctx, scale, x, y){
        ctx.fillStyle = this.color;
        for(var i = 0; i < this.height; i ++){
            for(var j = 0; j < this.width; j ++){
                if(this.tiles[i][j] == 1){
                    ctx.fillRect(x + (j - (this.width) / 2) * scale, y + (i - (this.height) / 2) * scale, scale, scale);
                }
            }
        }
    }

    hitsBoard(board){
        if(this.y + this.height - 1 > this.gameheight - 1){
            return true;
        }
        for(var i = 0; i < this.height; i ++){
            for(var j = 0; j < this.width; j ++){
                if(j + this.x >= 0 && j + this.x < this.gamewidth && this.tiles[i][j] == 1){
                    if(board.board[this.gameheight - 1 - (this.y + i)][this.x + j][0] == 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    hitsAnything(board){
        if(this.y + this.height - 1 > this.gameheight - 1){
            return true;
        }
        if(this.x + this.width - 1 > this.gamewidth - 1 || this.x < 0){
            return true;
        }
        for(var i = 0; i < this.height; i ++){
            for(var j = 0; j < this.width; j ++){
                if(j + this.x >= 0 && j + this.x < this.gamewidth && this.tiles[i][j] == 1){
                    if(board.board[this.gameheight - 1 - (this.y + i)][this.x + j][0] == 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    addToBoard(board){
        for(var i = 0; i < this.height; i ++){
            for(var j = 0; j < this.width; j ++){
                if(j + this.x >= 0 && j + this.x < this.gamewidth && this.tiles[i][j] == 1){
                    board.board[this.gameheight - 1 - (this.y + i)][this.x + j] = [1, this.color];
                }
            }
        }
    }

    step (board) {
        this.y += 1;
        if(this.hitsBoard(board)){
            this.y -= 1;
            this.addToBoard(board);
            this.onBoard = true;
        }
    }

    moveX(dir, board){
        this.x += dir;
        if(this.hitsAnything(board)){
            this.x -= dir;
        }
    }

    rotate(dir, board){
        this.timesRotated += dir;
        /*var newTile = [];
        for(var i = 0; i < this.width; i ++){
            newTile.push([]);
            for(var j = 0; j < this.height; j ++){
                newTile[i].push(0);
            }
        }
        if(dir == 1){
            for(var i = 0; i < this.height; i ++){
                for(var j = 0; j < this.width; j ++){
                    newTile[j][this.height - 1 - i] = this.tiles[i][j]; 
                }
            }
        } else {
            for(var i = 0; i < this.height; i ++){
                for(var j = 0; j < this.width; j ++){
                    newTile[this.width - 1 - j][i] = this.tiles[i][j]; 
                }
            }
        }*/
        if(this.timesRotated == -1){
            this.timesRotated = 3;
        }
        var newPiece = new Piece(this.rotations[this.timesRotated % 4], this.gamewidth, this.gameheight, this.x + this.rotationOffsets[this.timesRotated % 4][0] - this.rotationOffsets[(this.timesRotated + 3) % 4][0], this.y + this.rotationOffsets[this.timesRotated % 4][1] - this.rotationOffsets[(this.timesRotated + 3) % 4][1], this.color);
        if(!newPiece.hitsAnything(board)){
            this.width = newPiece.width;
            this.height = newPiece.height;
            this.tiles = newPiece.tiles;
            this.x = newPiece.x;
            this.y = newPiece.y;
        }
        else {
            this.timesRotated -= dir;
        }
    }
}
