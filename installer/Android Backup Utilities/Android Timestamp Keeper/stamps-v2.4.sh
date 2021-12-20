#!/bin/bash
# Android Timestamp Keeper v2.4
# Developed by dragomerlin, 07/12/2015
# Put this script inside the phone, for example under /sdcard/
# Timestamps go in timestamps.txt next to the script.
# It parses recursively from the specified directory.
# Paths are relative to stamps.sh
# Busybox is optional but recommended. If you don't have busybox on android use the epoch time.
# Root is required to write the timestamps, but not to read them.
# You can check for process com.android.systemui to detect android.
# Bash is required since sh doesn't have the [[ builtins. On android it's sh which is really bash.
# Usage:
# 	bash stamps.sh read directory
#	bash stamps.sh write directory
#
# Warning: to work properly on android it requires Busybox, however the "date" version included with
# busybox can mess things up with other android software, so if you experience problems with Play Store
# or connectivity uninstall busybox. There are two great versions on of it on the Play Store, one from
# Stericson and the other from Robert Nediyakalaparambil (this latest one doesn't have uninstaller, so
# use the Stericson version to uninstall it).
#
# There's an android native app which requires root, but the txt format is different
# https://play.google.com/store/apps/details?id=br.com.pogsoftwares.filetimestamp

# Examples
# Backup the timestamps of whole internal sdcard (relative to it).
# Better use relative paths to use from the computer also:
#	bash stamps.sh read ./
# Restore previous timestamps (timestamps.txt is parsed):
#	bash stamps.sh write

# Correct usage, example with epoch time 1357132455 (2 January 2013 at 13:14:15 UTC):
# - Cygwin (for Windows):  
#		touch -c -t 201301021314.15 picture.png
# - Android (with touch from Busybox from Stericson):
#		busybox touch -c -t 201301021314.15 picture.png
# - Some stock roms like the Samsung Galaxy S2 include a touch version that works
#	only with epoch. You will know it because the touch --h shows
#	touch: usage: touch [-alm] [-t time_t] <file>
#		touch -t 1357132455 picture.png
# - Linux (ubuntu): works both ways, busybox may be present or not:
#		[busybox] touch -c -t 201301021314.15 picture.png
# - BSD: better install busybox on it for stat and touch.
# - MAC (OS X): last modification time is shown in epoch or text
#		stat -f %N somefile
#		stat -f %m somefile
#		stat -f "%Sm" -t "%Y%m%H%M.%S" picture.png
#		touch -c -t 201301021314.15 picture.png

# TODO:
# Improve timestamps file management

command -v find >/dev/null 2>&1 || { echo >&2 "find is required"; exit 1; }
#command -v touch >/dev/null 2>&1 || { echo >&2 "touch is required"; exit 1; }
command -v sed >/dev/null 2>&1 || { echo >&2 "sed is required"; exit 1; }
command -v ps >/dev/null 2>&1 || { echo >&2 "ps is required"; exit 1; }
#command -v pgrep >/dev/null 2>&1 || { echo >&2 "pgrep is required"; exit 1; }

# root detection can become very tricky depending on operating system
# weroot=0
# if [[ $(id -u) == *root* ]]
# then
	# weroot=1
# fi
# if [ "$(id -u)" == "0" ]
# then
	# weroot=1
# fi
# if [ "$(busybox id -u)" == "0" ]
# then
	# weroot=1
# fi
# if [[ weroot -ne 0 ]]
# then
	# echo "This script must be run as root" 1>&2
	# exit 1
# fi

cname=0
cdate=0

if [[ -z $1 ]] || [[ -z $2 ]] || ( [ "$1" != "read" ] && [ "$1" != "write" ] )
	then
	echo "Usage: sh stamps.sh [read/write] directory"
	echo "Timestamps go in timestamps.txt"
	exit 0;
fi

# Check if working dir exists and it's not a symlink
if [[ -d "$2" && ! -L "$2" ]] ; then
	# Put one trailing slash for dirs in case there's more than one or none
	# Required to concatenate path strings
	WDIR=`echo $2 | sed -e "s,/\+$,,"`"/"
    echo "Working on dir: $WDIR"
else
	echo "Missing directory: $2"
	exit 1
fi


# if [ $1 = "read_epoch" ]
	# then
	# if [[ -f "timestamps.txt" ]]
	# then
		# rm timestamps.txt
	# fi
	# find "$2" -type f -exec stat -c %n {} > timestamps.txt \; -exec stat -c %Y {} > timestamps.txt \;
# fi

# if [ $1 = "read_yyyymmddhhmmss" ]
	# then
	# if [[ -f "timestamps.txt" ]]
	# then
		# rm timestamps.txt
	# fi
	# if [[ -f "temporallisting.txt" ]]
	# then
		# rm temporallisting.txt
	# fi
	# find "$2" -type f -exec echo {}>>temporallisting.txt \;
	
	# while read line
	# do
		# stat -c %y "$line"
	# done < temporallisting.txt
# fi


##################################
# On android we could use 'busybox stat' but the default works well
if [ "$1" = "read" ]
	then
	if [[ -f "timestamps.txt" ]]
	then
		rm timestamps.txt
	fi
#	This was to remove leading ./ when running "find ."
#	(cd $WDIR; find . -type f -exec sh -c 'stat -c %n "{}" | sed -e "s/^\.\///g" ' \; -exec stat -c %Y "{}" \; -exec sh -c 'stat -c %y "{}" | sed -e 's/-//g' | sed -e 's/://g' | sed -e "s/ //g" | cut -d '.' -f1 | sed "s/./.&/13" ' \;) >> timestamps.txt
	# Store relative paths to the input folder, not from script location.
	(cd "$WDIR"; find . -type f -exec sh -c 'stat -c %n "{}" ' \; -exec stat -c %Y "{}" \; -exec sh -c 'stat -c %y "{}" | sed -e 's/-//g' | sed -e 's/://g' | sed -e "s/ //g" | cut -d '.' -f1 | sed "s/./.&/13" ' \;) >> timestamps.txt

fi
##################################

##################################
if [ "$1" = "write" ]
then
	if [ ! -f timestamps.txt ]
	then
		echo "timestamps.txt does not exist on current dir"
		exit 0
	fi
	
	count=0
	
	while read line
	do
		if [[ count -eq 0 ]]
		then
			NAME=$line
		fi
		if [[ count -eq 1 ]]
		then
			EPOCH=$line
		fi
		if [[ count -eq 2 ]]
		then
			MODDATE=$line
		fi
		
		# Time to write
		if [[ count -eq 2 ]]
		then
			if [[ -f "$WDIR$NAME" ]]
			then
				# Busybox is present
				if busybox &> /dev/null
				then
					(cd "$WDIR" ; busybox touch -c -t "$MODDATE" "$NAME")
				else
					# Busybox not present (shouldn't be android)
					#echo "PATH is" "$WDIR$NAME"
					(cd "$WDIR" ; touch -c -t "$MODDATE" "$NAME")
				fi
			else
				echo "File" \"$WDIR$NAME\" "doesn't exist. Skipping."
			fi
		

		fi

		# Update counter
		if [[ count -eq 2 ]]
		then
			count=0
		else
			((count++))
		fi
		
		#echo $FILENAME
	done <timestamps.txt
	
fi
##################################

# if [ $1 = "write_android" ]
# then
	# if [ ! -f timestamps.txt ]
	# then
		# echo "timestamps.txt does not exist on current dir"
		# exit 0
	# fi
	# count=0
	# while read line
	# do
		# if [[ count -eq 0 ]]
		# then
			# NAME=$line
			##echo Name=$NAME
			# count=1
		# else
			# MODDATE=$line
			##echo Mod=$MODDATE
			# count=0
			# if [[ -f $NAME ]]
			# then
				# touch -m -t ${MODDATE} ${NAME}
			# else
				# echo "File" \"$NAME\" "doesn't exist. Skipping."
			# fi
		# fi
	# done <timestamps.txt
# fi

# if [ $1 = "write_linux" ]
# then
	
	# if [ ! -f timestamps.txt ]
	# then
		# echo "timestamps.txt does not exist on current dir"
		# exit 0
	# fi
	# count=0
	# while read line
	# do
		# if [[ count -eq 0 ]]
		# then
			# NAME=$line
			##echo Name=$NAME
			# count=1
		# else
			# MODDATE=$line
			##echo Mod=$MODDATE
			# count=0
			# if [[ -f $NAME ]]
			# then
				# LINUXDATE=$(date -d @$MODDATE '+%Y%m%d%H%M.%S')
				# touch -t $LINUXDATE ${NAME}
			# else
				# echo "File" \"$NAME\" "doesn't exist. Skipping."
			# fi
		# fi
	# done <timestamps.txt
# fi
