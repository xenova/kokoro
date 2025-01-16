import { KokoroTTS } from "kokoro-js";

const model_id = "onnx-community/Kokoro-82M-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
});

self.postMessage({ status: "ready" });

// Listen for messages from the main thread
self.addEventListener("message", async (e) => {
  const { text, voice } = e.data;

  // Generate speech
  const audio = await tts.generate(text, { voice });

  // Send the audio file back to the main thread
  const blob = audio.toBlob();
  self.postMessage({ status: "complete", audio: URL.createObjectURL(blob), text });
});
