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

// PROCESS BUTTON (demo only — no backend yet)
processBtn.onclick = async () => {
  if (!recordedBlob) {
    alert("Record something first!");
    return;
  }

  alert("Processing… (demo only, no AI backend yet)");

  // Fake "processed" audio by reusing the same blob
  const resultBlob = recordedBlob;
  const resultUrl = URL.createObjectURL(resultBlob);

  const processedPlayer = document.createElement("audio");
  processedPlayer.controls = true;
  processedPlayer.src = resultUrl;

  document.body.appendChild(processedPlayer);

  alert("Processed audio (demo) ready below");
};

