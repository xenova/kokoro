# Kokoro TTS

<p align="center">
    <a href="https://www.npmjs.com/package/kokoro-js"><img alt="NPM" src="https://img.shields.io/npm/v/kokoro-js"></a>
    <a href="https://www.npmjs.com/package/kokoro-js"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/kokoro-js"></a>
    <a href="https://www.jsdelivr.com/package/npm/kokoro-js"><img alt="jsDelivr Hits" src="https://img.shields.io/jsdelivr/npm/hw/kokoro-js"></a>
    <a href="https://github.com/hexgrad/kokoro/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/hexgrad/kokoro?color=blue"></a>
    <a href="https://huggingface.co/spaces/webml-community/kokoro-web"><img alt="Demo" src="https://img.shields.io/badge/Hugging_Face-demo-green"></a>
</p>

Kokoro is a frontier TTS model for its size of 82 million parameters (text in/audio out). This JavaScript library allows the model to be run 100% locally in the browser thanks to [🤗 Transformers.js](https://huggingface.co/docs/transformers.js). Try it out using our [online demo](https://huggingface.co/spaces/webml-community/kokoro-web)!

## Usage

First, install the `kokoro-js` library from [NPM](https://npmjs.com/package/kokoro-js) using:

```bash
npm i kokoro-js
```

You can then generate speech as follows:

```js
import { KokoroTTS } from "kokoro-js";

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

## Voices/Samples

> Life is like a box of chocolates. You never know what you're gonna get.

| Voice                    | Nationality | Gender | Sample                                                                                                   |
| ------------------------ | ----------- | ------ | -------------------------------------------------------------------------------------------------------- |
| Default (`af`)           | American    | Female | <video controls src="https://github.com/user-attachments/assets/c183df83-58a9-4aea-8fdf-225092acec57" /> |
| Bella (`af_bella`)       | American    | Female | <video controls src="https://github.com/user-attachments/assets/0730fff0-22b3-458f-9675-36d313d872d6" /> |
| Nicole (`af_nicole`)     | American    | Female | <video controls src="https://github.com/user-attachments/assets/4ce0b3f6-eaec-4e47-901c-9d29e2b60c86" /> |
| Sarah (`af_sarah`)       | American    | Female | <video controls src="https://github.com/user-attachments/assets/d37dba3f-de59-44c4-bc3d-da91ea1b5a4a" /> |
| Sky (`af_sky`)           | American    | Female | <video controls src="https://github.com/user-attachments/assets/38230be5-881c-4407-81e6-a0b1e4101565" /> |
| Adam (`am_adam`)         | American    | Male   | <video controls src="https://github.com/user-attachments/assets/66a4c439-e80b-4c91-8a27-ae094486a2d8" /> |
| Michael (`am_michael`)   | American    | Male   | <video controls src="https://github.com/user-attachments/assets/79a8879d-b564-4222-b2d5-a97f783ae897" /> |
| Emma (`bf_emma`)         | British     | Female | <video controls src="https://github.com/user-attachments/assets/ad5eb254-1d84-4282-9d23-371d5765d820" /> |
| Isabella (`bf_isabella`) | British     | Female | <video controls src="https://github.com/user-attachments/assets/ea7e6825-dad0-403c-9ece-680af04f5a25" /> |
| George (`bm_george`)     | British     | Male   | <video controls src="https://github.com/user-attachments/assets/e09040aa-578f-40a6-b7fd-76a5b005346c" /> |
| Lewis (`bm_lewis`)       | British     | Male   | <video controls src="https://github.com/user-attachments/assets/5d7b26bf-8900-4a9a-8ee5-a16c39bb834c" /> |
