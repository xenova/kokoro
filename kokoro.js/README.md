# Kokoro TTS


<p align="center">
    <a href="https://www.npmjs.com/package/kokoro-tts"><img alt="NPM" src="https://img.shields.io/npm/v/kokoro-tts"></a>
    <a href="https://www.npmjs.com/package/kokoro-tts"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/kokoro-tts"></a>
    <a href="https://www.jsdelivr.com/package/npm/kokoro-tts"><img alt="jsDelivr Hits" src="https://img.shields.io/jsdelivr/npm/hw/kokoro-tts"></a>
    <a href="https://github.com/hexgrad/kokoro/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/hexgrad/kokoro?color=blue"></a>
</p>


Kokoro is a frontier TTS model for its size of 82 million parameters (text in/audio out). This JavaScript library allows the model to be run 100% locally in the browser thanks to [🤗 Transformers.js](https://huggingface.co/docs/transformers.js).

## Usage

```js
import { KokoroTTS } from "kokoro-tts";

const model_id = "onnx-community/Kokoro-82M-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
});

const text = "Kokoro TTS is amazing!";
const audio = await tts.generate(text, {
  // Use `tts.list_voices()` to list all available voices
  voice: "af_nicole",
});
audio.save("audio.wav");
```
