const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const translation = document.getElementById('translation');

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// Capture and process
function capture() {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL('image/png');

  Tesseract.recognize(imageData, 'eng')
    .then(({ data: { text } }) => {
      output.innerText = text;
      translateText(text);
    });
}

// Translate using LibreTranslate
function translateText(text) {
  fetch('https://libretranslate.de/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: 'es',
      format: 'text'
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    translation.innerText = data.translatedText;
  });
}
