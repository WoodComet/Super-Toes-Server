
var udp = require('dgram');
var server = udp.createSocket('udp4');

server.on('message',function(msg,info){
    msgs = msg.toString();

    console.log('Data received from client : ' + msgs);
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
    

    //handeRequestTypes
    cmd = msg.substring(4);
    if(cmd.substring(0, 6) == 'Login:'){
        
        setup(cmd.substring(6));
        return;
    }

})
server.bind(8080);

function setup(players = 2){

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

function calcualteMoveResult(matrix){
    matrix2 = rotateMatrix(matrix);
    //check verticles
    checkVerticleMatch(matrix);
    checkVerticleMatch(matrix2);

    //check horizontals
    checkDiagonalMatch(matrix);
    checkDiagonalMatch(matrix2);
}

function checkVerticleMatch(matrix){
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

function checkDiagonalMatch(matrix){
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

function rotateMatrix(matrix){
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

function registerMove(player = 0, coords = [0, 0]){
    
    if(!Number.isInteger(player)) return;
    if(!Number.isInteger(coords[0])) return;
    if(!Number.isInteger(coords[1])) return;
    if(PositionsArray[1][0] != 0) return;
    
    PositionsArray[1][0] = player; 
    
}

console.log(setup(6));
while(true){

}