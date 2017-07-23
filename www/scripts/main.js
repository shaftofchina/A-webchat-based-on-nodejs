

var usernum;
window.onload = function() {
    var webchat = new WebChat();
    webchat.init();
    var olink=document.getElementById("sides");
    var status=document.getElementById('status');
    status.onclick=function()
    {
      show_hide(olink);
      return false;
    }
};
var WebChat = function() {
    this.socket = null;
};
WebChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function() {
            document.getElementById('info').textContent = '为你自己取一个昵称 √';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });

        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '昵称已存在，请重新输入';
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'webchat for ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        });
        this.socket.on('error', function(err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = 'fail to connect';
            } else {
                document.getElementById('info').textContent = 'fail to connect';
            }
        });
        this.socket.on('system', function(nickName, users, type) {
            var msg = nickName + (type == 'login' ? ' 进入了房间' : ' 离开了');
            usernum=users;
            that._displayNewMsg('系统', msg, 'red');
            document.getElementById('status').value = users.length + '人' + '在线';
        });
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });

        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.length != 0 && nickName.length < 7) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('info').textContent='昵称长度勿超过6,小于0';
                document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('我', msg, color);
                return;
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('我', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
    },

    _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
      //  if(user == '我')
    //    msgToDisplay.innerHTML =  '<span class="conten2">'+ msg + '</span>'+'<span class="tri2"></span>' +user + '<span class="timespan">(' + date + ') </span>' ;
    //    else
        msgToDisplay.innerHTML = '<span class="show">'+ user+'</span>' + '<span class="timespan">(' + date + '): </span>'+'<span class="tri"></span>'+'<span class="conten">'+ msg + '</span>'+'<br/></br>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
};


      function show_hide(obj){
        if(obj.style.display == "none")
        {for(var k=0;k<usernum.length;k++)
          {
            var newMember=document.createElement('p');
            newMember.innerHTML='<span class="msg">&nbsp'+usernum[k]+'&nbsp</span>';
            obj.appendChild(newMember);
          }
          obj.style.display='block';}
          else{
           document.getElementById('sides').innerHTML='  <p style=" color: gray;font-size: "> 在线列表:</p>';
           obj.style.display='none';
           }};
