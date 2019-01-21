var app = require('./config/server');


var server = app.listen(80, function(){
    console.log('Server ON');
});

var io = require('socket.io').listen(server);

app.set('io', io);

io.on('connection', function(socket) {
    console.log('User connected');

    socket.on('disconnect', function(){
        console.log('User disconnected');
    });
    
    socket.on('msgToServer', function(data){

        /* dialog */
        socket.emit('clientMsg', {
            nickname: data.nickname,
            msg: data.msg
        });

        socket.broadcast.emit('clientMsg', {
            nickname: data.nickname,
            msg: data.msg
        });

        /* room member list control */
        if (parseInt(data.login_sent) == 0) {
            socket.emit('userListControl', {
                nickname: data.nickname
            });

            socket.broadcast.emit('userListControl', {
                nickname: data.nickname
            });
        }

    });    
});