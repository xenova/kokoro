# Kokoro TTS

<p align="center">
    <a href="https://www.npmjs.com/package/kokoro-tts"><img alt="NPM" src="https://img.shields.io/npm/v/kokoro-tts"></a>
    <a href="https://www.npmjs.com/package/kokoro-tts"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/kokoro-tts"></a>
    <a href="https://www.jsdelivr.com/package/npm/kokoro-tts"><img alt="jsDelivr Hits" src="https://img.shields.io/jsdelivr/npm/hw/kokoro-tts"></a>
    <a href="https://github.com/hexgrad/kokoro/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/hexgrad/kokoro?color=blue"></a>
</p>

Kokoro is a frontier TTS model for its size of 82 million parameters (text in/audio out). This JavaScript library allows the model to be run 100% locally in the browser thanks to [🤗 Transformers.js](https://huggingface.co/docs/transformers.js).

## Usage

First, install the `kokoro-tts` library from [NPM](https://npmjs.com/package/kokoro-tts) using:

```bash
npm i kokoro-tts
```

You can then generate speech as follows:

```js
import { KokoroTTS } from "kokoro-tts";

const model_id = "onnx-community/Kokoro-82M-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
});

const text = "Life is like a box of chocolates. You never know what you're gonna get.";
const audio = await tts.generate(text, {
  // Use `tts.list_voices()` to list all available voices
  voice: "af_bella",
});
audio.save("audio.wav");
```

## Samples

> Life is like a box of chocolates. You never know what you're gonna get.

| Voice                    | Nationality | Gender | Sample                                                                                                                                  |
| ------------------------ | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Default (`af`)           | American    | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/C0_ZUcNSAxvMwpS8QbnKv.wav"></audio> |
| Bella (`af_bella`)       | American    | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/B_q15Z_FXdgBP9-Hk9oKq.wav"></audio> |
| Nicole (`af_nicole`)     | American    | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/sS8U5lQHkhgX7rwTmy-5w.wav"></audio> |
| Sarah (`af_sarah`)       | American    | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/SokkBiqEqwxLLx_pqvf1p.wav"></audio> |
| Sky (`af_sky`)           | American    | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/IzySGHUtl5mYeFxx1oaRf.wav"></audio> |
| Adam (`am_adam`)         | American    | Male   | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/9n6myE6--ZsEuF5xDv5eC.wav"></audio> |
| Michael (`am_michael`)   | American    | Male   | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/EPFciGtTU1YUXu8MAw7DX.wav"></audio> |
| Emma (`bf_emma`)         | British     | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/AGEsXs-gyJq3dsyo7PjHo.wav"></audio> |
| Isabella (`bf_isabella`) | British     | Female | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/JEzrrXYJSDcmlEzI7tE0c.wav"></audio> |
| George (`bm_george`)     | British     | Male   | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/nsv4zKB4MX2TvXRxv504k.wav"></audio> |
| Lewis (`bm_lewis`)       | British     | Male   | <audio controls src="https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/g_mcBl2xTbQl0sbrpZt48.wav"></audio> |
