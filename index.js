var udp = require('dgram');
const { fs } = require('fs');
var server = udp.createSocket('udp4');
require("./tictacserver");
server.on('message',function(msg,info){
    msg = msg.toString();

    if(getUserByInfo(info) == undefined){

        if(msg.substring(0, 10) == 'CMD:Login:'){
            
            createUser(info, msg.substring(6));
            
        }
        return;
    }
    //handel client commands
    if(msg == "HB"){
        getUserByInfo(info).lastHBUTC = Date.now();
        return;
    }
    else if(msg.substring(0, 4) == 'CMD:'){

        cmd = msg.substring(4);

        rm = getUserByInfo(info).room;

        if(rm != MainLoby){

            if(cmd.substring(0, 7) == "GMINFO:"){

                if(GameInfo != undefined) GameInfo(cmd.substring(7));
                return;
            }
            if(cmd.substring(0, 6) == "SETGM:"){
                game = cmd.substring(6);
                console.log(game)
                if(game == "TTT"){
                    sendPacketToAllInRoom("RMINFO:SETGM:TicTacToe", rm);
                    rm.myGame = new TicTacToeGame;
                    rm.myGame.myRoom = rm;
                    GameInfo = rm.myGame.onRoomInfo;
                }
                return;
            }
            if(cmd.substring(0, 8) == "ExitRoom"){
                getUserByInfo(info).leaveRoom();
                return;
            }
        }
        if(cmd.substring(0, 9) == "JoinRoom:"){
            console.log(cmd.substring(9))
            addUserToRoom(info, cmd.substring(9));
            return;
        }
        if(cmd.substring(0, 4) == "Host"){
            console.log(cmd.substring(4))
            GenerateRoom(info);
            
            return;
        }

        return;
    }


})
server.bind(2989);
console.log(setup(6));

function RunMainLoby(room){
    sendPacketToAllInRoom("RoomTick", room);
}
function sendPacket(what, port, address){
    server.send(what, port, address);
    
}
function sendPacketToAllInRoom(msg, room){
    for(i in room.users){
        player = room.users[i];
        sendPacket(msg, player.port, player.address);
    }
}
function createUser(info, Name = 'Username'){
    if(getUserByInfo(info) == null){
        newUser = new user;
        newUser.name = Name;
        newUser.address = info.address;
        newUser.port = info.port;
        newUser.lastHBUTC = Date.now();
        activeUsers.push(newUser);
        console.log("New user created!");
        sendPacket('ACCNT:LogGood', info.port, info.address);
        addUserToLoby(newUser);
    }
    else{
        //sendPacket('AlredySignedIn!', info.port, info.address);
        console.log("user existed!");
    }

}
function addUserToRoom(info, roomName){
    User = getUserByInfo(info);
    Room = getRoomByName(roomName);
    if(User != null && Room != null){
        if(!Room.inprogress){
            Room.users.push(User);
            if(User.room != null){
                User.leaveRoom();
            }
            User.room = Room;
            sendPacket("RMINFO:JoinedRoom:" + roomName, User.port, User.address);
        }
        else{
            sendPacket("RMINFO:UnableToJoinRoom:" + roomName, User.port, User.address);
        }

    }
}
function addUserToLoby(User){
    if(User != null && MainLoby != null){
        MainLoby.users.push(User);
        if(User.room != null){
            User.leaveRoom();
        }
        User.room = MainLoby;
        sendPacket("RMINFO:JoinedTheLoby", User.port, User.address);
    }
}
function RoomLoop(Room){
    sendPacketToAllInRoom("RoomTick", Room);
    for(player of Room.users){
        console.log(Date.now() - player.lastHBUTC);
        if(Math.floor((Date.now() - player.lastHBUTC) / 1000) > 5) player.leaveRoom();

    }
    
    console.log("looping room: " + Room.name);
    if(Room.users.length < 1) Room.destroyRoom(Room);
    if(!Room.host){
        console.log("selectingNewHost");
        Room.host = Room.users[0];
    }
}
function GenerateRoom(creator){
    NewRoom = new room;
    rName = "";
    while(rName.length < 6){
        rName += Math.floor(Math.random() * 9);
    }
    
    while(getRoomByName(rName) != null){
        rName += ("+");
        console.log("Room Alredy Exists!");
    }
    NewRoom.name = rName;
    roomlist.push(NewRoom);
    MainLoby.addRoomToLoby(NewRoom);
    addUserToRoom(creator, rName);

}
function getUserByInfo(info){
    for(i in activeUsers){
        User = activeUsers[i];
        if(User.port == info.port && User.address == info.address){
            console.log(User.name);
            return User;
        }
    }
    return null;
}
function getRoomByName(name){
    for(i in roomlist){
        Room = roomlist[i];
        if(Room.name == name){
            console.log("found room: " + Room.name);
            return Room;
        }
    }
    console.log("unable to find room");
    return null;
}

class user{
    name = 'New User';
    address = '';
    port = '';
    room = null;
    lastHBUTC = '';
    leaveRoom(){
        console.log("User Leaving Room");
        this.room.users.splice(this.room.users.indexOf(this), 1);
        this.room = null;
    }
}

class room{
    name = 'New Room';
    users = [];
    MinimumMembers = 2;
    roomIntervalLoop = '';
    inprogress = false;
    myGame;
    host;
    initalizeRoom(){
        console.log("room name: " + this.name + " opened")
        this.roomIntervalLoop = setInterval(RoomLoop, 500, this);
        //setTimeout(this.startgame, lifetime, this)
    }

    startgame(myself){
        myself.inprogress = true;
        sendPacketToAllInRoom('StartGame', myself);
        console.log('Started room: ' + myself.name);
    }

    destroyRoom(myself){
        clearInterval(this.roomIntervalLoop);
        roomlist.splice(roomlist.indexOf(myself), 1);
        myself = undefined;
    }


}

class loby extends room{
    lobyRooms = [];

    initalizeRoom(){
        super.name = 'MainLobby';
        setInterval(RunMainLoby, 500, this);
        console.log(this.lobyRooms);
    }

    startgame(){
        console.log("Cannot start game in lobby!");
    }

    addRoomToLoby(myRoom){
        this.lobyRooms.push(myRoom);
        myRoom.initalizeRoom();
        console.log(this.lobyRooms);
    }
}

roomlist = [];
activeUsers = [];

MainLoby = new loby;
MainLoby.initalizeRoom();