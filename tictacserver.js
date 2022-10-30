global.setup = function(players = 2){

    PositionsArray = [];
    
    for (let i = 0; i < players + 1; i++) {
        xArray = []
        for (let ii = 0; ii < players + 1; ii++) {
            xArray[ii] = ii + i
        }
        PositionsArray[i] = xArray;
    }
    calcualteMoveResult(PositionsArray);
    return PositionsArray;

}

global.calcualteMoveResult = function(matrix){
    matrix2 = rotateMatrix(matrix);
    //check verticles
    checkVerticleMatch(matrix);
    checkVerticleMatch(matrix2);

    //check horizontals
    checkDiagonalMatch(matrix);
    checkDiagonalMatch(matrix2);
}

global.checkVerticleMatch = function(matrix){
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            // checking the conditions
            if(matrix[y][x] != 0){
                if(matrix[y][x] == matrix[y][x + 1] && matrix[y][x + 1] == matrix[y][x + 2]){
                    console.log("match with" + matrix[y][x]);
                }
            }
        }
    }
}

global.checkDiagonalMatch = function(matrix){
    for (let y = 0; y < matrix.length - 2; y++) {
        for (let x = 0; x < matrix.length; x++) {
            // checking the conditions
            if(matrix[y][x] != 0){
                if(matrix[y][x] == matrix[y + 1][x + 1] && matrix[y + 1][x + 1] == matrix[y + 2][x + 2]){
                    console.log("match with" + matrix[y][x]);
                }
            }
        }
    }
}

global.rotateMatrix = function(matrix){
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

global.registerMove = function(player = 0, coords = [0, 0]){
    
    if(!Number.isInteger(player)) return;
    if(!Number.isInteger(coords[0])) return;
    if(!Number.isInteger(coords[1])) return;
    if(PositionsArray[1][0] != 0) return;
    
    PositionsArray[1][0] = player; 
    
}

global.TicTacToeGame = class {
    myRoom;
    
    constructor(){
        console.log("binding this")
        this.onRoomInfo.bind(this);
    }

    onRoomInfo(user, msg){
        console.log("recived room info: " + msg);
        if(this.myRoom.host = user){
            if(msg == "StartRound") startRound();
        }
    }
    

    startRound(){
        sendPacketToAllInRoom("RMINFO:Begin", this.myRoom);
    }



}