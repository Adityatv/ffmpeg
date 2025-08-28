#!/bin/bash
set -e
VIDEO_URL="$1"
OUTPUT_NAME="$2"

if [ -z "$VIDEO_URL" ] || [ -z "$OUTPUT_NAME" ]; then
  echo "Usage: $0 VIDEO_URL OUTPUT_NAME"
  exit 1
fi

OUT_DIR="/app/public"
mkdir -p "$OUT_DIR"

TMP_MKV="$OUT_DIR/${OUTPUT_NAME}.mkv"

# download (with retry)
curl -L --retry 3 --retry-delay 5 "$VIDEO_URL" -o "$TMP_MKV"

# convert to HLS
ffmpeg -y -i "$TMP_MKV"   -codec:v copy -codec:a copy   -start_number 0   -hls_time 10   -hls_list_size 0   -hls_flags independent_segments   -f hls "$OUT_DIR/${OUTPUT_NAME}.m3u8"

rm -f "$TMP_MKV"

echo "Converted: ${OUTPUT_NAME}.m3u8"
