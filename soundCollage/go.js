//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var rec;              //Recorder.js object
var input;              //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

function start(){
  startRecording()
}

function startRecording() {
  console.log("recordButton clicked");
  var constraints = { audio: true, video:false }
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
    audioContext = new AudioContext();
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input,{numChannels:1})
    rec.record()
    console.log("Recording started");
    setTimeout(stopRecording, 3000)
  }).catch(function(err) {
  });
}

function stopRecording() {
  console.log("stopButton clicked");
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(sendToServer);
}

function sendToServer(blob) {
  var xhr=new XMLHttpRequest();
  xhr.onload=function(e) {
    if(this.readyState === 4) {
      console.log("Server returned: ",e.target.responseText);
    }
  };
  var fd=new FormData();
  fd.append("audio_data",blob, "filename");
  xhr.open("POST","http://127.0.0.1:5000/",true);
  xhr.send(fd);

}





