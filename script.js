const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const processBtn = document.getElementById("processBtn");
const styleSelect = document.getElementById("styleSelect");

let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;

// RECORD
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

    const player = document.getElementById("originalAudio");
    player.src = audioUrl;
    player.style.display = "block";

    alert("Recording ready!");
  };

  mediaRecorder.start();
  alert("Recording started");
};

// STOP
stopBtn.onclick = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

// PROCESS (REAL AI BACKEND)
processBtn.onclick = async () => {
  if (!recordedBlob) {
    alert("Record something first!");
    return;
  }

  const style = styleSelect.value;

  const formData = new FormData();
  formData.append("audio", recordedBlob, "input.wav");
  formData.append("data", JSON.stringify([null, style]));

  alert("Processing… please wait");

  try {
    const response = await fetch("https://samuelkash-vocal-fix-backend.hf.space/run/predict", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    const processedBase64 = result.data[0];
    const processedAudio = document.getElementById("processedAudio");

    processedAudio.src = "data:audio/wav;base64," + processedBase64;
    processedAudio.style.display = "block";

    alert("Processed audio ready!");
  } catch (error) {
    console.error(error);
    alert("Error processing audio");
  }
};
