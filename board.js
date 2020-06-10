class Board{
    constructor(rows, cols, sideLength){
        this.turn = 0;
        this.rows = rows;
        this.cols = cols;
        this.sideLength = sideLength;
        this.mat = this.make2DMat(this.rows, this.cols);
        this.createSquares();
        this.winner = false;
        this.pieces = new Array();
    }

    make2DMat(rows, cols){
        let twoDArray = new Array(rows);
        for(let i = 0; i < twoDArray.length; i++){
            twoDArray[i] = new Array(cols);
        }
        return twoDArray;
    }

    createSquares(){
        for(let r = 0; r < this.mat.length; r++){
            for(let c = 0; c < this.mat[r].length; c++){
                this.mat[r][c] = new Cell(r,c,this.sideLength)
            }    
        }
    }

    show(){
        for (var r = 0; r < board.mat.length; r++) {
            for (var c = 0; c < board.mat[r].length; c++) {
              board.mat[r][c].show();
            }
        }
    }

    checkFour(r, c, rCrement, cCrement){
        let streak = 0;

        for(let i = 0; i < 4; i++){
            if(this.checkInBounds(r,c) && this.currentSpotEquals(r,c,this.currentPos.playedBy)){
                streak += 1;
            }
            if(streak == 4){
                return true;
            }
            r += rCrement;
            c += cCrement;
        }
        return false;
    }
    
    // isFour(streak){
    //     // if(streak == 4){
    //         return (streak == 4);
    //     // }
    // }

    currentSpotEquals(r, c, turn){
        return this.mat[r][c].playedBy == turn;
    }

    checkInBounds(r, c){
        return (r > -1 && r < this.mat.length) && (c > -1 && c < this.mat[r].length);
    }

    setCurrentPos(r,c){
        this.currentPos = this.mat[r][c];
    }

    incrementTurn(){
        this.turn++;
    }

    getTurn(){
        return (this.turn & 1) == 0 ? "human" : "enemy";
    }

    update(){
        let current = this.currentPos;
        for(let r = current.r; r < this.mat.length-1; r++){
            let a = this.mat[r][current.c];
            let b = this.mat[r+1][current.c];
            
            if(b.clicked){
                break;
            }
            a.click(false);
            b.click(true);
            b.setPlayedBy(a.playedBy);
            a.setPlayedBy(null);
            this.currentPos = b;
        }
        this.pieces.push(this.currentPos);
        
        return this.checkWinner();
    }

    checkWinner(){
        for(let i  = 0; i < this.pieces.length; i++){
            if(this.checkPieceWinner(this.pieces[i].r,this.pieces[i].c)){
                return true;
            }
        }
        return false;
    }


    checkPieceWinner(rLoc, cLoc){
        let directions = [[0,-3,0,1], [0,3,0,-1], [-3,0,1,0], [3,0,-1,0], [-3,-3,1,1], [3,3,-1,-1], [-3,3,1,-1], [3,-3,-1,1]];

        for(let i = 0; i < directions.length; i++){
            if(this.checkFour(rLoc + directions[i][0], cLoc + directions[i][1], directions[i][2], directions[i][3])){
                return true;
            }
        }
        // //checks right of the row
        // win.push(this.checkFour(rLoc, cLoc - 3, 0, 1));
        
        // //checks left of the row
        // win.push(this.checkFour(rLoc, cLoc + 3, 0, -1));
        
        // //checks up in the column
        // win.push(this.checkFour(rLoc - 3, cLoc , 1, 0));
        
        // //checks down in the column
        // win.push(this.checkFour(rLoc + 3, cLoc, -1, 0));
       
        // //checks top left diagonal
        // win.push(this.checkFour(rLoc - 3, cLoc - 3, 1, 1));
        
        // //checks bottom right diagonal
        // win.push(this.checkFour(rLoc + 3, cLoc + 3, -1, -1));
        
        // //checks top right diagonal
        // win.push(this.checkFour(rLoc - 3, cLoc + 3, 1, -1));
        
        // //checks bottom left diagonal
        // win.push(this.checkFour(rLoc + 3, cLoc - 3, -1, 1));
        return false;
    }

    // minimax(board, depth, isMaximizing){

    // }
}

class Cell{
    constructor(r,c,w){
        this.r = r;
        this.c = c;
        this.w = w;
        this.clicked = false;
        this.x = c * w;
        this.y = r * w;
    }

    setImage(image){
        this.image = image;
    }

    show(){
        
        stroke(0);
        noFill();

        fill(255);
        
        let circ = this.w * .9;
        square(this.x,this.y,this.w);
        if(this.clicked){
            if(this.playedBy=="human"){
                // stroke(220,30,30);
                fill(237,39,39);
            }
            else{
                // noStroke();
                // stroke(218,226,40);
                fill(234,243,31);
            }
            circle(this.x+this.w/2,this.y+this.w/2,circ);

            // image(this.image, this.x, this.y);
        }
    }

    inBounds(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
    }

    click(bool){
        this.clicked = bool;
    }

    setPlayedBy(playedBy){
        this.playedBy = playedBy;
    }
}