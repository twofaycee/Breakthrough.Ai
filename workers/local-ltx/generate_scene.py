import argparse
import os
import subprocess


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--prompt',required=True)
    parser.add_argument('--output',required=True)
    parser.add_argument('--duration',type=int,default=8)
    args=parser.parse_args()

    required={
        'transformer':os.getenv('LTX_TRANSFORMER_PATH'),
        'text_encoder':os.getenv('LTX_TEXT_ENCODER_PATH'),
        'video_vae':os.getenv('LTX_VIDEO_VAE_PATH'),
        'audio_vae':os.getenv('LTX_AUDIO_VAE_PATH'),
        'duration_head':os.getenv('LTX_DURATION_HEAD_PATH'),
        'spatial_upsampler':os.getenv('LTX_SPATIAL_UPSAMPLER_PATH'),
    }
    missing=[name for name,value in required.items() if not value]
    if missing:
        raise SystemExit('Missing LTX environment variables: '+', '.join(missing))

    cmd=[
        os.getenv('LTX_PYTHON','python'),'-m','ltx_pipelines.distilled',
        '--transformer-path',required['transformer'],
        '--text-encoder-path',required['text_encoder'],
        '--video-vae-path',required['video_vae'],
        '--audio-vae-path',required['audio_vae'],
        '--duration-head-path',required['duration_head'],
        '--spatial-upsampler-path',required['spatial_upsampler'],
        '--prompt',args.prompt,
        '--seed',str(abs(hash(args.prompt)) % (2**31)),
        '--output-path',args.output,
    ]
    subprocess.run(cmd,check=True)
    if not os.path.exists(args.output):
        raise SystemExit('LTX completed without creating the expected output file')
    print(args.output)


if __name__=='__main__':
    main()
