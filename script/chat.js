window.onload=function(){
	let congChat=new CongChat();
	congChat.init();
};
let CongChat=function(){
	
};
CongChat.prototype={
	init(){
		let infoMessage=document.getElementById('infoMessage'),
			loginArea=document.getElementById('loginArea'),
			that=this;
			this.users=[];
			this.nickname='';
			this.green=245;
		loginArea.classList.add('login-area-appear');
		this.socket=io.connect('http://localhost:8833/');
		this.socket.on('connect',function(){		
			infoMessage.classList.remove('error');
			infoMessage.classList.add('success');
			infoMessage.innerText="";
		});
		this.socket.on('nickExisted',function(){
			infoMessage.classList.remove('success');
			infoMessage.classList.add('error');
			infoMessage.innerText="用户名已存在";
		});
		this.socket.on('loginSuccess',function(usersList,emojiArray){
			let emojiArea=document.getElementById('emojiArea');
			emojiArray.forEach(function(item,index){
				let div=document.createElement('div'),
					img=document.createElement('img');
				img.src="./images/chat-tool/emoji/"+item;
				img.title=item.split('.')[0];
				div.appendChild(img);
				emojiArea.appendChild(div);
			});//获取表情包
			infoMessage.classList.remove('error');
			infoMessage.classList.add('success');
			infoMessage.innerText="正在进入聊天.....";
			that.users=usersList;
			that.nickname=document.getElementById('nicknameInput').value.trim();
			that.showUserListInit(usersList,document.getElementById('nicknameInput').value.trim());
			loginArea.classList.remove('login-area-appear');
			document.getElementById('chatArea').classList.add('chat-area-show');
			setTimeout(function(){
				loginArea.style.display="none";
			},1000);


			that.socket.on('someoneLogout',function(nickname,users,type){//提示当前用户某些用户下线
			let li=document.createElement('div');
			li.innerHTML=`<div class="other-enter">
								<i class="other-nickname">${nickname}</i>离开了聊天
							</div>`;
			document.getElementById('messageList').appendChild(li);
			that.showUserListInit(users);
			});

			that.socket.on('someoneLogin',function(nickname,users){//提示当前用户谁加入聊天
				let li=document.createElement('div');
				li.innerHTML=`<div class="other-enter">
									<i class="other-nickname">${nickname}</i>加入了聊天
								</div>`;
				document.getElementById('messageList').appendChild(li);
				that.showUserListInit(users);
			});

			that.socket.on('someoneSendMessage',function(nickname,message){//接受信息
				let li=document.createElement('div');
				li.innerHTML=`<div class="message others">
									<div class="sender-photo">
										<div>
											<img src="./images/亚索.png" />
										</div>
									</div>
									<div class="sender-other">
										<div class="sender-name">${nickname}</div>
										<div class="single-message">${message}</div>
									</div>
								</div>`;
				document.getElementById('messageList').appendChild(li);
				that.scrollToDown(document.getElementById('messageShowContainer'));
			});

			that.socket.on('someoneSendEmoji',function(nickname,imgSrc,imgName){//接受表情包
				let li=document.createElement('div');
				li.innerHTML=`<div class="message others">
									<div class="sender-photo">
										<div>
											<img src="./images/亚索.png" />
										</div>
									</div>
									<div class="sender-other">
										<div class="sender-name">${nickname}</div>
										<img src="${imgSrc}"/>
									</div>
								</div>`;
				document.getElementById('messageList').appendChild(li);
				that.scrollToDown(document.getElementById('messageShowContainer'));
				that.emojiFunction(imgName);
			});
		});
		
		document.getElementById('showEmojiArea').addEventListener('click',function(){//显示表情包
			let emojiArea=document.getElementById('emojiArea');
			emojiArea.classList.toggle('emoji-area-show');
		});
		document.getElementById('joinChat').addEventListener('click',function(){//注册
			let nickname=document.getElementById('nicknameInput').value.trim();
			if(nickname!=""){
				infoMessage.classList.add('success');
				infoMessage.innerText="连接中。。。。。。";
				that.socket.emit('login',nickname);
			}else{
				document.getElementById('nicknameInput').focus();
			}
		},false);
		document.getElementById('sendMessageButton').addEventListener('click',function(){//发送信息
			let message=document.getElementById('sendMessageContent').value.trim();
			if(message!=''){
				document.getElementById('sendMessageContent').value="";
				let li=document.createElement('div');
				that.socket.emit('sendMessage',message);
				li.innerHTML=`<div class="message your">								
									<div class="sender-other">
										<div class="sender-name">${that.nickname}</div>
										<div class="single-message">${message}</div>
									</div>
									<div class="sender-photo">
										<div>
											<img src="./images/亚索2.png" />
										</div>
									</div>
					</div>`;
				document.getElementById('messageList').appendChild(li);
				document.getElementById('sendMessageContent').focus();
				that.scrollToDown(document.getElementById('messageShowContainer'));
				
			}
			else{
				alert('消息发送不能为空');
			}
		},false);
		document.getElementById('emojiArea').addEventListener('click',function(event){//发送表情包
			var e=event||window.event;
			let target=e.target;
			if(target.tagName.toLowerCase()=='img'){
				that.socket.emit('sendEmoji',target.src,target.title);
				let li=document.createElement('div');
				li.innerHTML=`<div class="message your">								
									<div class="sender-other">
										<div class="sender-name">${that.nickname}</div>
										<img src="${target.src}"/>
									</div>
									<div class="sender-photo">
										<div>
											<img src="./images/亚索2.png" />
										</div>
									</div>
					</div>`;
				document.getElementById('messageList').appendChild(li);
				document.getElementById('emojiArea').classList.remove('emoji-area-show');
				that.scrollToDown(document.getElementById('messageShowContainer'));
			}
		});
	},
	showUserListInit(users){
		let userList=document.getElementById('userList'),
			htmlStr="";
		users.forEach(function(item,index){
			htmlStr=htmlStr+`<li>
								<img src="./images/timg.jpg" width="50px" height="50px">
								<span>${item}</span>
							</li>`;
		});
		userList.innerHTML=htmlStr;
		document.getElementById('userNumber').innerText=users.length;
	},
	emojiFunction(imgName){
		console.log(imgName);
		switch(imgName){
			case '帅':
				document.getElementById('sendMessageContent').value="对！你真帅！";
				break;
			case '旋转':
				document.getElementById('chatWindow').classList.add('chat-window-rotate');
				setTimeout(function(){
					document.getElementById('chatWindow').classList.remove('chat-window-rotate');
				},1000);
				break;
			case '变绿':
				if(this.green>=5)
				{
					this.green-=5;
					document.getElementById('chatWindowBody').style=`background:rgba(${this.green},245,${this.green},1)`;
				}
				break;
		}
	},
	scrollToDown(dom){
		// dom.scrollTop+=dom.scrollHeight;
		// console.log(dom.scrollTop+" "+dom.scrollHeight);
		let i=0;
		while(i<dom.scrollHeight){
			dom.scrollTop+=1;
			i++;
		}
	
	}
}