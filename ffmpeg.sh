#!/bin/bash
# Quick AI Shorts — Production FFmpeg Pipeline
# Converts 16:9 video to 9:16 vertical Short with hardcoded subtitles
# 16:9 video ko 9:16 vertical Short mein convert karta hai subtitles ke sath

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

INPUT_VIDEO="${1:-input.mp4}"
CAPTIONS_FILE="${2:-captions.srt}"
OUTPUT_VIDEO="${3:-output_9by16.mp4}"

# Output dimensions (9:16 vertical)
OUTPUT_WIDTH=1080
OUTPUT_HEIGHT=1920

# Encoding settings
PRESET="slow"           # Options: ultrafast, fast, medium, slow, veryslow
CRF="22"                # Quality: 18-28 (lower = better quality, larger file)
AUDIO_BITRATE="128k"
AUDIO_SAMPLERATE="48000"

# Subtitle styling
FONT_NAME="Inter"
FONT_SIZE="36"
OUTLINE="1"
MARGIN_V="30"

# ============================================================================
# FFMPEG COMMAND — PRODUCTION READY
# ============================================================================

echo "Processing: ${INPUT_VIDEO}"
echo "Captions: ${CAPTIONS_FILE}"
echo "Output: ${OUTPUT_VIDEO}"

ffmpeg -y -i "${INPUT_VIDEO}" \
  -vf " \
    scale='min(${OUTPUT_WIDTH},iw)':-2, \
    crop=ih*9/16:ih, \
    pad=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:(${OUTPUT_WIDTH}-out_w)/2:(${OUTPUT_HEIGHT}-out_h)/2:black, \
    subtitles=${CAPTIONS_FILE}:force_style='FontName=${FONT_NAME},FontSize=${FONT_SIZE},Outline=${OUTLINE},MarginV=${MARGIN_V},PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Alignment=2' \
  " \
  -c:v libx264 \
  -preset "${PRESET}" \
  -crf "${CRF}" \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a "${AUDIO_BITRATE}" \
  -ar "${AUDIO_SAMPLERATE}" \
  -max_muxing_queue_size 9999 \
  "${OUTPUT_VIDEO}"

echo "Done: ${OUTPUT_VIDEO}"

# ============================================================================
# ALTERNATIVE: GPU-ACCELERATED (NVIDIA)
# ============================================================================

# Uncomment for NVIDIA GPU acceleration (requires CUDA-enabled FFmpeg build):
#
# ffmpeg -y -hwaccel cuda -hwaccel_output_format cuda -i "${INPUT_VIDEO}" \
#   -vf " \
#     scale_cuda='min(${OUTPUT_WIDTH},iw)':-2, \
#     hwdownload,format=nv12, \
#     crop=ih*9/16:ih, \
#     pad=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:(${OUTPUT_WIDTH}-out_w)/2:(${OUTPUT_HEIGHT}-out_h)/2:black, \
#     subtitles=${CAPTIONS_FILE}:force_style='FontName=${FONT_NAME},FontSize=${FONT_SIZE},Outline=${OUTLINE},MarginV=${MARGIN_V}' \
#   " \
#   -c:v h264_nvenc \
#   -preset p4 \
#   -cq ${CRF} \
#   -movflags +faststart \
#   -c:a aac \
#   -b:a "${AUDIO_BITRATE}" \
#   "${OUTPUT_VIDEO}"

# ============================================================================
# NOTES
# ============================================================================

# INPUT:
# - input.mp4 should be a high-quality source or proxy
# - Recommended: 1080p or higher for best results
# - Input proxy use karo. Original quality best results dega.

# CAPTIONS:
# - captions.srt must have validated timestamps matching the clip
# - Ensure timestamps are synced to trimmed segment, not original video
# - Max 42 characters per line for readability
# - Captions SRT timestamps validate karo. Trimmed segment ke sath sync hona chahiye.

# SERVERLESS DEPLOYMENT:
# - Run FFmpeg in a container image (Alpine + FFmpeg static build)
# - Stream input/output from object store (S3/R2/GCS)
# - Use ephemeral storage for temp files
# - Serverless mein FFmpeg container use karo. Objects ko stream karo.

# PERFORMANCE:
# - Use -preset slow for quality (production)
# - Use -preset fast for speed (previews)
# - GPU acceleration: 3-5x faster on NVIDIA
# - Quality ke liye slow preset. Speed ke liye fast preset use karo.

# AUDIO:
# - 48kHz sample rate for platform compatibility
# - AAC codec for universal support
# - 128k bitrate sufficient for speech-heavy content

# ============================================================================
# QUICK REFERENCE COMMANDS
# ============================================================================

# Extract audio for transcription:
# ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav

# Generate thumbnail from video:
# ffmpeg -i input.mp4 -ss 00:00:05 -vframes 1 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" thumbnail.jpg

# Convert SRT to ASS (for advanced styling):
# ffmpeg -i captions.srt captions.ass

# Trim video segment (no re-encode):
# ffmpeg -ss 00:01:30 -i input.mp4 -t 00:00:45 -c copy trimmed.mp4

# ============================================================================
# END
# ============================================================================
