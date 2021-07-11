//JS for front-end

//const { text } = require('express');

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var myUserId = "";
var users = 0;
var userArray = [];

//creating a peer
var peer = new Peer(undefined, {
    path: "/peerjs",
    host: '/',
    port: '443'
});

let myVideoStream = null
const peers = {}
var connectedClients = {}
var message = $("#message")
var send_message = $("#send_message")

//getting access to user's video and audio
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
  }).then(stream => {
      users++;
      myVideoStream = stream;
      addVideoStream(myVideo, stream)

      const name = prompt('Enter your nickname:')
      connectionMessage(`you joined`)
      socket.emit('new-user', name)

      //new user calls us
      peer.on('call', call => {
          call.answer(stream) // answer the new user's call
          const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream) //adds new user's video stream
            })
      })

      //passing the user's stream to socket
      socket.on('user-connected', (userId) => {
          myUserId = userId;
          userArray.push(userId);
            setTimeout(function ()
            {
              connectToNewUser(userId, stream);
              console.log('new user connection')
            },1000
          )
      })
      //Emit message
      send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
      })

      //Listen on new_message
      socket.on("new_message", (data) => {
        message.val('');
        $('ul').append(`<li class="message"><b>${data.username}</b><br/>${data.message}</li>`);
        scrollToBottom();
      })
  })

socket.on("user-disconnected", (userId) => {
  console.log("New User Disconnected");
  if (peers[userId]) peers[userId].close();
  videoGrid.removeChild(videoGrid.childNodes[1]);
  alert("you are the only user left");
});

// share screen handler function
const shareScreen = async () => {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia();
  } catch (err) {
    console.error("Error: " + err);
  }
  peer.call(myUserId, captureStream);
  const video = document.createElement("video");
  addVideoStream(video, captureStream);
};

peer.on('open', id => { // When we first open the app, have us join a room
  socket.emit('join-room', ROOM_ID, id);
})

//calling new user  
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream) //calls new user and sends them our stream
    const video = document.createElement('video') //creates new video element for new user
    video.id = userId;
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream) //sends new user our stream
    })
    call.on("close", () => {
      console.log('check')
      video.remove();
    })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
      video.play();
  })
  videoGrid.append(video);
}

const connectionMessage = (message) => {
  $('ul').append(`<li class="message"><b>${message}</b>`);
  scrollToBottom();
}

const scrollToBottom = () => {
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled; //gets our video stream and selects our audio track and takes the value of whether it's unabled or disabled
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } 
    else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}

// URL Copy To Clipboard
function getURL() {
  const c_url = window.location.href;
  copyToClipboard(c_url);
  alert("Url Copied to Clipboard,\nShare it with your Friends!\nUrl: " + c_url);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
} 

// End Call
function endCall(){
  peer.destroy();
  window.location.href = "/disconnect";
}