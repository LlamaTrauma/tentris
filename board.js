class Board {
    constructor(width, height){
        this.board = [];
        this.width = width;
        this.height = height;
        for(var i = 0; i < this.height + 20; i ++){
            this.board.push([]);
            for(var j = 0; j < this.width; j ++){
                this.board[i].push([0, "rgb(0, 0, 0)"]);
            }
        }
    }

    determineTetris(){
        for(var i = 0; i < this.height + 20; i ++){
            var tetris = true;
            for(var j = 0; j < this.width; j ++){
                if(this.board[i][j][0] == 0){
                    tetris = false;
                }
            }
            if(tetris){
                this.board.splice(i, 1);
                this.board.push([]);
                i -= 1;
                linesCleared += 1;
                for(var j = 0; j < this.width; j ++){
                    this.board[this.board.length - 1].push([0, "rgb(0, 0, 0)"]);
                }
            }
        }
    }

    draw(ctx, scale){
        for(var i = 0; i < this.height + 20; i ++){
            for(var j = 0; j < this.width; j ++){
                if(this.board[i][j][0] == 1){
                    ctx.fillStyle = this.board[i][j][1];
                    ctx.fillRect(j * scale, (this.height - 1 - i) * scale, scale, scale);
                }
            }
        }
    }
}