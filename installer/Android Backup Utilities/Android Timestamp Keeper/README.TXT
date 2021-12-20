Android Timestamp Keeper v3.1
Developed by dragomerlin, 30/07/2017
Put this script inside the phone, for example under /sdcard/
Timestamps go in timestamps.txt next to the script.
It parses recursively from the specified directory.
Paths are relative to stamps.sh
 is optional but recommended. If you don't have  on android use the epoch time.
Root is required to write the timestamps, but not to read them.
You can check for process com.android.systemui to detect android.
Bash is required since sh doesn't have the [[ builtins. On android it's sh which is really bash.
Usage:
	bash stamps.sh read directory
	bash stamps.sh write directory

Warning: to work properly on android it requires , however the "date" version included with
 can mess things up with other android software, so if you experience problems with Play Store
or connectivity uninstall . There are two great versions on of it on the Play Store, one from
Stericson and the other from Robert Nediyakalaparambil (this latest one doesn't have uninstaller, so
use the Stericson version to uninstall it).

There's an android native app which requires root, but the txt format is different
https://play.google.com/store/apps/details?id=br.com.pogsoftwares.filetimestamp

Examples
Backup the timestamps of whole internal sdcard (relative to it).
Better use relative paths to use from the computer also:
	bash stamps.sh read .
Restore previous timestamps (timestamps.txt is parsed):
	bash stamps.sh write .

Correct usage, example with epoch time 1357132455 (2 January 2013 at 13:14:15 UTC):
- Cygwin (for Windows):  
	touch -c -t 201301021314.15 picture.png
- Android (with touch from  from Stericson):
	 touch -c -t 201301021314.15 picture.png
- Some stock roms like the Samsung Galaxy S2 include a touch version that works
only with epoch. You will know it because the touch --h shows
touch: usage: touch [-alm] [-t time_t] <file>
	touch -t 1357132455 picture.png
- Linux (ubuntu): works both ways,  may be present or not:
	[] touch -c -t 201301021314.15 picture.png
- BSD: better install  on it for stat and touch.
- MAC (OS X): last modification time is shown in epoch or text
	stat -f %N somefile
	stat -f %m somefile
	stat -f "%Sm" -t "%Y%m%H%M.%S" picture.png
	touch -c -t 201301021314.15 picture.png
