

global.calcualteMoveResult = function(matrix){
    let matrix2 = rotateMatrix(matrix);
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



global.TicTacToeGame = class {
    myRoom;
    PositionsArray;

    constructor(){
        console.log("binding this");
        this.onRoomInfo = this.onRoomInfo.bind(this);
    }

    onRoomInfo(user, msg){
        console.log("recived room info: " + msg);
        if(this.myRoom.host = user){
            if(msg == "StartRound") this.startRound();
        }
        if(msg.substring(0, 4) == "CLM:") this.registerMove(user.getPositionInRoom(), msg.substring(4).split(","));
    }
    

    startRound(){
        this.myRoom.sendPacketToAllInRoom("RMINFO:Begin", this.myRoom);
        this.setup(this.myRoom.users.length);
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
        if(!Number.isInteger(coords[0])) return;
        if(!Number.isInteger(coords[1])) return;
        if(this.PositionsArray[coords[1]][coords[0]] != 0) return;
        
        this.PositionsArray[1][0] = player; 
        this.myRoom.sendPacketToAllInRoom("RMINFO:CLM:" + player + ":" + coords[0] + "," + coords[1], this.myRoom);
        console.log("user" + player + " claimed tile: " + coords);
    }



}