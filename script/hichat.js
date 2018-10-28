window.onload=function(){
	let hichat=new HiChat();
	hichat.init();
};
let HiChat=function(){
	this.socket=null;
};
HiChat.prototype={
	init:function(){
		let that=this;

		this.socket=io.connect("http://localhost:8833/");
		this.socket.on('connect',function(){
			document.getElementById('info').textContent="get yourself a nickname:";
			document.getElementById('nickWrapper').style.display="block";
			document.getElementById('nicknameInput').focus();
		});
		this.socket.on('nickExisted',function(){
			document.getElementById('info').innerText="nickname is existed"
		});
		document.getElementById('loginBtn').addEventListener('click',function(){
			let nickname=document.getElementById('nicknameInput').value;
			if(nickname.trim().length!=0){
				that.socket.emit('login',nickName);
			}else{
				document.getElementById('nicknameInput').focus();
			}
		},false);
	}
};
document.getElementById('loginBtn').addEventListener('click',function(){

})