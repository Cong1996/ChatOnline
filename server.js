var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    users=[],
    fs=require('fs'),
    emojiArray=[],
    io = require('socket.io').listen(server); //引入socket.io模块并绑定到服务器
app.use('/', express.static(__dirname));
server.listen(8833);
const files=fs.readdirSync(__dirname+'/images/chat-tool/emoji');
files.forEach(function(item,index){
	emojiArray.push(item);//获取表情包路径
});

//socket部分
io.on('connection', function(socket) {
    //接收并处理客户端发送的foo事件
    socket.on('login',function(nickname){
    	if(users.indexOf(nickname)>-1){
    		socket.emit('nickExisted');
    	}
    	else{
    		socket.userIndex=users.length;
	    	socket.nickname=nickname;
	    	users.push(nickname);
	    	socket.emit('loginSuccess',users,emojiArray);
	    	socket.broadcast.emit('someoneLogin',nickname,users);

    	}
    });
    socket.on('disconnect',function(){
        if(!socket.nickname)
            return;
    	for(let i=0;i<users.length;i++){
    		if(users[i]==socket.nickname){
    			users.splice(i,1);
    		}
    	}
    	socket.broadcast.emit('someoneLogout',socket.nickname,users);//通知除自己外所有人
    });
    socket.on('sendMessage',function(message){//发送消息
    	socket.broadcast.emit('someoneSendMessage',socket.nickname,message);
    });
    socket.on('sendEmoji',function(imgSrc){//发送表情包
    	socket.broadcast.emit('someoneSendEmoji',socket.nickname,imgSrc);
    });
});