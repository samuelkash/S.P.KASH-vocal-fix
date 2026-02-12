let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");

recordBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

 mediaRecorder.onstop = () => {
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  audioChunks = [];

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();

  console.log("Recording finished:", audioBlob);
  alert("Playing back your recording");
};

  };

  mediaRecorder.start();
  alert("Recording started");
};

stopBtn.onclick = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

