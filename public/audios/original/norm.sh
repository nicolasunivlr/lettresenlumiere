#!/bin/bash
for f in *.mp3; do
    ffmpeg -i "$f" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 "normalized/${f%.*}.mp3"
done
