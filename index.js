var udp = require('dgram');
var server = udp.createSocket('udp4');

server.on('message',function(msg,info){
    msg = msg.toString();

    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

    //handel client commands

    if(msg.substring(0, 4) == 'CMD:'){

        cmd = msg.substring(4);
        if(cmd.substring(0, 6) == 'Login:'){
            
            createUser(info, cmd.substring(6));
            return;
        }

        if(cmd.substring(0, 8) == "ExitRoom"){
            getUserByInfo(info).leaveRoom();
            return;
        }

        if(cmd.substring(0, 9) == "JoinRoom:"){
            console.log(cmd.substring(9))
            addUserToRoom(info, cmd.substring(9));
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
        Room.users.push(User);
        if(User.room != null){
            User.leaveRoom();
        }
        User.room = Room;
        sendPacket("RMINFO:JoinedRoom:" + roomName, User.port, User.address);
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
function GenerateRoom(){
    NewRoom = new room;
    rName = Titles[Math.floor(Math.random() * 6)];
    while(getRoomByName(rName) != null){
        rName += ("+");
        console.log("Room Alredy Exists!");
    }
    NewRoom.name = rName;
    roomlist.push(NewRoom);
    MainLoby.addRoomToLoby(NewRoom);
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

    leaveRoom(){
        this.room.users.pop(this);
        this.room = null;
    }
}

class room{
    name = 'New Room';
    map = '';
    mode = '';
    users = [];
    MinimumMembers = 2;

    inprogress = false;

    initalizeRoom(){
        console.log("room name: " + this.name + " opened")
        setInterval(RoomLoop, 500, this);
        //setTimeout(this.startgame, lifetime, this)
    }

    startgame(myself){
        myself.inprogress = true;
        sendPacketToAllInRoom('StartGame', myself);
        console.log('Started room: ' + myself.name);
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