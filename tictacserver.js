

global.calcualteMoveResult = function(matrix){
    let matrix2 = rotateMatrix(matrix);
    //check verticles
    if(checkVerticleMatch(matrix) || checkVerticleMatch(matrix2)) return true;


    //check horizontals
    if(checkDiagonalMatch(matrix) || checkDiagonalMatch(matrix2)) return true; 

    return false;
    
}

global.checkVerticleMatch = function(matrix){
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            // checking the conditions
            if(matrix[y][x] != 0){
                if(matrix[y][x] == matrix[y][x + 1] && matrix[y][x + 1] == matrix[y][x + 2]){
                    return true;
                }
            }
        }
    }
    return false;
}

global.checkDiagonalMatch = function(matrix){
    for (let y = 0; y < matrix.length - 2; y++) {
        for (let x = 0; x < matrix.length; x++) {
            // checking the conditions
            if(matrix[y][x] != 0){
                if(matrix[y][x] == matrix[y + 1][x + 1] && matrix[y + 1][x + 1] == matrix[y + 2][x + 2]){
                    return matrix[y][x];
                }
            }
        }
    }
}

global.rotateMatrix = function(matrix){
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}



global.TicTacToeGame = class {
    myRoom;
    PositionsArray;
    currentPlayer = 1;
    boardSize = 2;
    constructor(){
        console.log("binding this");
        this.onRoomInfo = this.onRoomInfo.bind(this);
    }

    onRoomInfo(user, msg){
        console.log("recived room info: " + msg);
        if(this.myRoom.host = user){
            if(msg == "StartRound") this.startRound();
        }
        if(msg.substring(0, 4) == "CLM:") this.registerMove(user.getPositionInRoom() + 1, msg.substring(4).split(","));
        if(msg.substring(0, 7) == "BRDSIZE"){
            this.boardSize = this.myRoom.users.length;
            sendPacket("RMINFO:BRDSIZE:" + this.boardSize, user.port, user.address);
        } 
    }
    

    startRound(){
        for(var i in this.myRoom.users){
            var player = this.myRoom.users[i];
            sendPacket("RMINFO:URTURN:" + (parseInt(i) + 1), player.port, player.address);
        }
        this.myRoom.sendPacketToAllInRoom("RMINFO:Begin", this.myRoom);
        this.setup(this.myRoom.users.length);
        this.currentPlayer = 1;
    }

    setup(players = 2){

        this.PositionsArray = [];
        
        for (let i = 0; i < players + 1; i++) {
            let xArray = []
            for (let ii = 0; ii < players + 1; ii++) {
                xArray[ii] = 0;
            }
            this.PositionsArray[i] = xArray;
        }
    
    }

    registerMove(player = 0, coords = [0, 0]){
        
        if(!Number.isInteger(player)) return;
        if(!Number.isInteger(parseInt(coords[0]))) return;
        if(!Number.isInteger(parseInt(coords[1]))) return;
        if(this.PositionsArray[coords[1]][coords[0]] != 0) return;
        if(this.currentPlayer != player) return;
        
        this.PositionsArray[coords[1]][coords[0]] = player; 
        this.myRoom.sendPacketToAllInRoom("RMINFO:CLM:" + player + ":" + coords[0] + ":" + coords[1]);

        if(calcualteMoveResult(this.PositionsArray)){
            this.myRoom.sendPacketToAllInRoom("RMINFO:WNR:" + player);
            this.currentPlayer = 0;
        }
        else{
            this.nextPlayer(player);
        }
        
    }

    nextPlayer(player = 0){
        player += 1;
        if(player > this.myRoom.users.length){
            player -= this.myRoom.users.length;
        }      
        this.currentPlayer = player;
        this.myRoom.sendPacketToAllInRoom("RMINFO:NXTTRN:" + player);
    }



}