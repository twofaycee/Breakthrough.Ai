# BREAKTHROUGH Local LTX Worker

This worker is the zero-cost generation path for BREAKTHROUGH. It runs on your own computer and talks to the existing Supabase production queue. No Fal credits or paid video API are required.

## Requirements

- Windows 10/11 or Linux
- NVIDIA CUDA GPU with at least 16GB VRAM for LTX Desktop/local LTX 2.5 Fast; more VRAM is better.
- 16GB+ system RAM; 32GB recommended
- Large local disk for model weights and generated video
- Python environment with the LTX-2.5 pipeline installed

LTX documents both ComfyUI and a native Python pipeline for local LTX-2.5 generation. See https://docs.ltx.io/open-source-model/getting-started/quick-start.

## Setup

1. Install the LTX-2.5 Python pipeline using the official Lightricks repository.
2. Download the required LTX-2.5 model files into a local models directory.
3. Set these environment variables in the worker machine:

```text
BREAKTHROUGH_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
BREAKTHROUGH_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
LTX_PYTHON=python
LTX_ROOT=C:\path\to\LTX-2
LTX_TRANSFORMER_PATH=C:\path\to\models\ltx-2.5\diffusion_models\ltx-2.5-22b-distilled-transformer-bf16.safetensors
LTX_TEXT_ENCODER_PATH=C:\path\to\models\ltx-2.5\text_encoders\gemma4-12b-with-proj-ltx-2.5-bf16.safetensors
LTX_VIDEO_VAE_PATH=C:\path\to\models\ltx-2.5\vae\ltx-2.5-video-vae-bf16.safetensors
LTX_AUDIO_VAE_PATH=C:\path\to\models\ltx-2.5\vae\ltx-2.5-audio-vae-bf16.safetensors
LTX_DURATION_HEAD_PATH=C:\path\to\models\ltx-2.5\model_patches\ltx-2.5-duration-head-bf16.safetensors
LTX_SPATIAL_UPSAMPLER_PATH=C:\path\to\models\ltx-2.3\ltx-2.3-spatial-upscaler-x2-1.1.safetensors
BREAKTHROUGH_OUTPUT_DIR=C:\breakthrough-output
```

4. Run `node workers/local-ltx/worker.mjs`.

The worker polls queued production scenes, claims one at a time, generates the scene locally with LTX-2.5, and writes the resulting local asset path and status back to Supabase.

## Security

The service-role key belongs only on the local worker. Never put it in Next.js client code, browser JavaScript, or public Vercel environment variables.

## Important

The worker is intentionally local. Vercel cannot run the LTX model itself. The BREAKTHROUGH website remains hosted normally while the local worker supplies the actual AI video generation.
