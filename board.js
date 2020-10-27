class Board{
    static directions = [[0,-3,0,1], [0,3,0,-1], [-3,0,1,0], [3,0,-1,0], [-3,-3,1,1], [3,3,-1,-1], [-3,3,1,-1], [3,-3,-1,1]];
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
        let composition = {"human":0, "computer":0, "unplayed":0};
        for(let i = 0; i < 4; i++){
            if(this.checkInBounds(r,c)){
                composition[this.mat[r][c].playedBy] = composition[this.mat[r][c].playedBy] + 1;
            }
            r += rCrement;
            c += cCrement;
        }
        return composition;
    }
    
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
        return (this.turn & 1) == 0 ? "human" : "computer";
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
            a.setPlayedBy("unplayed");
            this.currentPos = b;
        }
        this.pieces.push(this.currentPos);
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
        for(let i = 0; i < Board.directions.length; i++){
            let dict = this.checkFour(rLoc + Board.directions[i][0], cLoc + Board.directions[i][1], Board.directions[i][2], Board.directions[i][3]);
            for(let key in dict)
            if(dict[key] == 4){
                return true;
            }
        }
        return false;
    }

    score(){
        let max = -Infinity;
        for(let i in this.pieces){
            let piece = this.pieces[i];
            let piecesScores = [];
            for(let i = 0; i < Board.directions.length; i++){
                let rLoc = piece.r;
                let cLoc = piece.c;
                let dict = this.checkFour(rLoc + Board.directions[i][0], cLoc + Board.directions[i][1], Board.directions[i][2], Board.directions[i][3]);
                // console.log(dict)
                piecesScores.push(this.scoreFromCombination(dict["human"],dict["computer"],dict["unplayed"],piece.r,piece.c));
            }
            max = Math.max(piecesScores.reduce((a,b) => Math.max(a,b)), max)
        }
        return max;
    }

    scoreFromCombination(human, computer, unplayed,r,c){
        if(computer == 4){
            return 1000;
        }
        if(computer==3 && unplayed == 0 && this.checkInBounds(r+1,c) && this.mat[r+1][c].playedBy != "unplayed"){
            return 500;
            console.log("HEY");
        } 
        if(human==3 && unplayed == 0 && this.checkInBounds(r+1,c) && this.mat[r+1][c].playedBy != "unplayed"){
            return -500;
            console.log("HEY");
        } 
        if(human == 4)
            return -10000;
        return -human * 200 + computer * 200 + unplayed * 50; //need to reward unplayed pathway
    }

    undoMove(){
        let piece = this.pieces.pop();
        piece.click(false);
        piece.playedBy = "unplayed";

    }

    miniMax(depth, player){
        if(this.checkWinner() || depth > 3){
            return this.score();
        }

        if(player == "computer"){
            let hiScore = -Infinity;
            for(let i = 0; i < this.mat[0].length; i++){
                if(this.mat[0][i].playedBy == "unplayed"){
                    this.setCurrentPos(0,i);
                    this.mat[0][i].click(true);
                    this.mat[0][i].setPlayedBy("computer");
                    this.update();
                    let score = this.miniMax(depth + 1, "human");
                    this.undoMove(); 
                    hiScore = Math.max(hiScore, score);
                }
            }
            return hiScore;
        }

        else{
            let hiScore = Infinity;
            for(let i = 0; i < this.mat[0].length; i++){
                if(this.mat[0][i].playedBy == "unplayed"){
                    this.setCurrentPos(0,i);
                    this.mat[0][i].click(true);
                    this.mat[0][i].setPlayedBy("human");
                    this.update();
                    let score = this.miniMax(depth + 1, "computer");
                    this.undoMove(); 
                    hiScore = Math.min(hiScore, score);
                }
            }
            return hiScore;
        }
    }

    move(r,c){

    }

    computerMove(){
        let hiScore = -Infinity;
        let move;
        for(let i = 0; i < this.mat[0].length; i++){
            if(this.mat[0][i].playedBy == "unplayed"){
                this.setCurrentPos(0,i);
                this.mat[0][i].click(true);
                this.mat[0][i].setPlayedBy("computer");
                this.update();
                let score = this.miniMax(0, "human");
                this.undoMove(); 
                if (score > hiScore) {
                    hiScore = score;
                    move = [0 , i];
                }
            }
        }
        this.setCurrentPos(move[0], move[1]);
        this.mat[move[0]][move[1]].click(true);
        this.mat[move[0]][move[1]].setPlayedBy("computer");
        this.update();
        this.incrementTurn();
    }
}

class Cell{
    constructor(r,c,w){
        this.r = r;
        this.c = c;
        this.w = w;
        this.clicked = false;
        this.x = c * w;
        this.y = r * w;
        this.playedBy = "unplayed";
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
                fill(237,39,39);
            }
            else if (this.playedBy=="computer"){
                fill(234,243,31);
            }
            circle(this.x+this.w/2,this.y+this.w/2,circ);

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
