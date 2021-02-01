var canvas = document.getElementById("tetrisCanvas");
var ctx = canvas.getContext("2d");
console.log(ctx);

var Game = {
    canvas: document.getElementById("tetrisCanvas"),
    ctx: this.canvas.getContext("2d"),
    currentPiece: 0,
    heldPiece: null,
    nextPieces: [],
    size: size,
    width: Math.floor(this.size * 5 / 2),
    height: this.size * 5,
    widthpx: 0,
    heightpx: 0,
    cwidth: 0,
    piecePool: [],
    board: 0,
    setInterval: null,
    over: false,
    runInterval: null,
    scale: Math.floor(500 / this.width),
    drawPool: function (){
        drawPieces(this.piecePool);
    },
    makeRandomPiece: function(){
        return new Piece(this.piecePool[Math.floor(Math.random() * this.piecePool.length)], this.width, this.height);
    },
    start: function(){
        this.over = false;
        this.width = Math.floor(this.size * 5 / 2);
        this.height = this.size * 5;
        this.piecePool = findTiles(this.size);
        //this.width = 4;
        canvas.height = 1000;
        canvas.width = 1000 * this.width / this.height + 300;
        this.cwidth = canvas.width - 300;
        this.scale =  this.cwidth / this.width;
        canvas.style.height = "70vh";
        canvas.style.width = canvas.getBoundingClientRect().height * canvas.width / canvas.height;
        var bounding = canvas.getBoundingClientRect();
        this.widthpx = bounding.width;
        this.heightpx = bounding.height;
        this.board = new Board(this.width, this.height);
        this.currentPiece = this.makeRandomPiece();
        this.nextPieces = [];
        this.heldPiece = null;
        for(var i = 0; i < 3; i ++){
            this.nextPieces.push(this.makeRandomPiece());
        }
    },
    giveNextPiece: function(){
        var nextPiece = this.nextPieces.shift();
        this.currentPiece = new Piece(nextPiece.tiles, this.width, this.height);
        if(this.currentPiece.hitsAnything(this.board)){
            this.over = true;
            clearInterval(this.stepInterval);
            clearInterval(this.runInterval);
            return;
        }
        this.currentPiece.color = nextPiece.color;
        this.nextPieces.push(this.makeRandomPiece());
    },
    step: function(){
        this.currentPiece.step(this.board);
        if(this.currentPiece.onBoard){
            this.giveNextPiece();
            if(this.over){
                return;
            }
            this.board.determineTetris();
        }
    }, run: function (){
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "#b5773f";
        ctx.fillRect(this.cwidth, 0, 300, this.canvas.height);
        for(var i = 0; i < 3; i ++){
            ctx.fillStyle = "#fff";
            var h = (canvas.height / 2) / 3;
            var s = h - 20;
            var x = this.cwidth + (300 - (h - 20)) / 2;
            var y = canvas.height / 2 + i * h
            if(i == 0){
                ctx.fillRect(x, x - this.cwidth, s, s);
                ctx.fillStyle = "#000";
                ctx.font = "30px Arial";
                ctx.fillText("Line Clears: " + linesCleared, x - 20, canvas.height / 2 - 100);
                ctx.fillStyle = "#fff";
            }
            ctx.fillRect(x, y, s, s);
            this.nextPieces[i].drawAt(ctx, 100 / size, x + s / 2, y + s / 2);
            if(i == 0 && this.heldPiece != null){
                this.heldPiece.drawAt(ctx, 100 / size, x + s / 2, x - 500 + s / 2);
            }
        }
        this.board.draw(ctx, this.scale);
        this.currentPiece.draw(ctx, this.scale);
    }
}

var keyFun = function (e) {
    if (e.key === "ArrowLeft") {
        Game.currentPiece.moveX(-1, Game.board);
    } else if (e.key === "ArrowRight") {
        Game.currentPiece.moveX(1, Game.board);
    } else if (e.key === "ArrowDown") {
        Game.step();
    } else if (e.key === "a") {
        Game.currentPiece.rotate(-1, Game.board);
    } else if (e.key === "d") {
        Game.currentPiece.rotate(1, Game.board);
    } else if (e.key === "s") {
        if(Game.heldPiece != null){
            var hold1 = Game.currentPiece.tiles;
            var hold2 = Game.currentPiece.color;
            Game.currentPiece = new Piece(Game.heldPiece.tiles, Game.width, Game.height); 
            Game.currentPiece.color = Game.heldPiece.color;
            Game.heldPiece = new Piece(hold1, Game.width, Game.height);
            Game.heldPiece.color = hold2;
        } else {
            Game.heldPiece = new Piece(Game.currentPiece.tiles, Game.width, Game.height);
            Game.heldPiece.color = Game.currentPiece.color;
            Game.giveNextPiece();
        }
    }
}

document.getElementById("startBtn").onclick = function(e){
    size = Math.max(0, Math.min(document.getElementById("piecesize").value, 10));
    Game.size = size;
    Game.start();
    clearInterval(Game.stepInterval);
    clearInterval(Game.runInterval);
    Game.stepInterval = setInterval(function(){Game.step()}, 400);
    Game.runInterval = setInterval(function(){Game.run()}, 33);

    document.removeEventListener("keydown", keyFun);


    document.addEventListener("keydown", keyFun);
}
