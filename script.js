let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const processBtn = document.getElementById("processBtn");

// RECORD BUTTON
recordBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  audioChunks = [];

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    recordedBlob = new Blob(audioChunks, { type: "audio/wav" });

    const audioUrl = URL.createObjectURL(recordedBlob);

    const player = document.createElement("audio");
    player.controls = true;
    player.src = audioUrl;

    document.body.appendChild(player);

    alert("Recording ready below");
  };

  mediaRecorder.start();
  alert("Recording started");
};

// STOP BUTTON
stopBtn.onclick = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

// PROCESS BUTTON
processBtn.onclick = async () => {
  if (!recordedBlob) {
    alert("Record something first!");
    return;
  }

  alert("Processing… please wait");

  const formData = new FormData();
  formData.append("audio", recordedBlob);
  formData.append("style", "clean"); // later we connect this to your dropdown

  // IMPORTANT: Replace YOURSPACE with your Hugging Face Space name
  const response = await fetch("https://YOURSPACE.hf.space/run/predict", {
    method: "POST",
    body: formData
  });

  const resultBlob = await response.blob();
  const resultUrl = URL.createObjectURL(resultBlob);

  const processedPlayer = document.createElement("audio");
  processedPlayer.controls = true;
  processedPlayer.src = resultUrl;

  document.body.appendChild(processedPlayer);

  alert("Processed audio ready below");
};
