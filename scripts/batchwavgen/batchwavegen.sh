#!/bin/bash
ROOTDIR=/mnt/h/A13_mp3/*
for d in $ROOTDIR ; do
    echo "$d"
    
	FILES=$d/*.mp3
	for f in $FILES ; do
		if [ ! -d "$f" ]; then
			echo "Processing $f file..."
			filename=$(basename -- "$f")
			extension="${filename##*.}"
			filename="${filename%.*}"

			mkdir -p $d/audiowaveform_512
			if [ ! -f $d/audiowaveform_512/$filename.dat ] ; then
			    echo "No dat found...generating."
			    touch $d/audiowaveform_512/$filename.dat
			    audiowaveform -b 8 -z 512 -i $d/$filename.$extension -o $d/audiowaveform_512/$filename.dat
			else
				echo "dat already generated...skipping."
			fi

			mkdir -p $d/audiowaveform_512_json
			if [ ! -f $d/audiowaveform_512_json/$filename.json ] ; then
			    echo "No json found...generating."
			    touch $d/audiowaveform_512_json/$filename.json
			    audiowaveform -b 8 -z 512 -i $d/$filename.$extension -o $d/audiowaveform_512_json/$filename.json
			else
				echo "json already generated...skipping."
			fi
		fi
	done
done