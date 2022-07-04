const path = require ('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const {Server} = require('socket.io');

const io = new Server (server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname + '../public/views')));
app.use(express.static(path.join(__dirname + '/public/css')));
app.use(express.static(path.join(__dirname + '/node_modules/bootstrap/dist/')));

app.get('/', (req,res) => {
    res.render('../public/views/index');
});

var userList = [];

io.on('connection', (socket) => {

    var currentUser = {

    }

    
    io.emit('update-userlist', userList);

    socket.on('disconnect', () => {
        let index = userList.map((u) => { return u.id}).indexOf(socket.id);
        userList.splice(index, 1);
        
        io.emit('update-userlist', userList);
    });

    socket.on('request-join', userInfo => {

        currentUser = {
            id: socket.id,
            name: userInfo.name,
            color: userInfo.color
        }

        userList.push(currentUser);
        socket.emit('join-chat', userList);
        io.emit('update-userlist', userList);
    });


    socket.on('request-send_message', message => {

        socket.broadcast.emit('receive-message', message);

    });


});

/*function GetUser(id)
{
return userList.find(u => u.userID === id );
}

*/
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});