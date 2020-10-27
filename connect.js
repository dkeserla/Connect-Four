let board;
let height;
let width;
let restart;
let win;

function setup() {
    height = 720;
    width= 1024;
    createCanvas(width, height);
    board = new Board(6,7,floor(height/6));
    restart = createButton('Restart');
    restart.position(width-10, height-10);
    restart.mousePressed(() => {
        win = false;
        board = new Board(6,7,floor(height/6));
    });
    win = false;
}

function draw() {
    background(255);
    board.show();
    if(win){
        fill(0);
        textSize(32);
        text(board.currentPos.playedBy + " is the winner",height/2,width/2);
    }
    
}

function mousePressed(){
    for (var r = 0; r < board.mat.length; r++) {
        for (var c = 0; c < board.mat[r].length; c++) {
            if (!win && board.mat[r][c].inBounds(mouseX, mouseY) && !board.mat[r][c].clicked) {
                board.setCurrentPos(r,c);
                board.mat[r][c].click(true);
                board.mat[r][c].setPlayedBy(board.getTurn());
                board.update();
                win = board.checkWinner();
                board.incrementTurn();
              }
        }
    }
    if(!win){
        board.computerMove();
        win = board.checkWinner();
    }
}
