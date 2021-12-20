Tar Binary Splitter

1) Application scope and capabilities
This java application allows two different operations on tar archives. Such operations can be invoked from command line depending on the argument provided:

1.1) -split-subtar:
splits a tar archive into separate subtars without extracting the contents to the hard drive and then re-archiving.
The need to split tar backups without extracting them is a must when the filename of some item has characters not supported by the 
current operating system. For example OS X allows the use of backspaces, asterisk, colon, semicolon and so on as part of a 
filename, which is not allowed by Windows. Thus such characters may be renamed on extraction, and if extracting a tar archive and 
creating a new one with each item, the resulting parts will be damaged.

To make this a little more complicated, there are more than one tar formats, and each format can pack the data inside the tar in different ways.
So this program aims further than just separating android adb backups, but be more of a general use.

- Characters that are illegal on filenames:
	-Windows: \ / : * ? " < > |
	-Linux: '/' and '\0'
	-OS X: not sure

1.2) -split-android:
Generates a tar archive for each android app, which consist of one or more subtars inside.
The need for this application came from the desire to split adb backups. Android adb backup generates a single ab file when performing a backup.
Thanks to Android Backup Extractor you can decrypt the ab file to a tar archive, but everything is into a single archive. Then separating that 
archive in parts is very helpful, so you can edit or restore each individual android app or android's shared storages. In this case it acts the same
as '-split-subtar' except that generates a single tar archive for each applicationId of android. It reads all subtars for each android app consecutively
and puts them into a tar, everything in binary mode without extracting anything to the hard drive (for the same reasons as the other option).
So to speak, this option splits the adb backup by android app so you can keep or restore them separately.
Shared (internal and external storages like sdcards) use its own tar archive.
This usage is the main purpose of Tar Binary Splitter.

2) Tar Binary Splitter works on the following way:
- Creates folder "split-subtar" or "split-android" on current dir if doesn't exist
- Data already present inside "split-subtar" or "split-android" is not deleted, but overwritten if data to be generated already exists
- Uses the Apache Common compress libraries to detect subtar boundaries inside the main tar archive
- If "split-subtar" is selected, save the subtar(s) inside "split-subtar" folder, naming them in sequential numbering order.
- If "split-android" is selected, save the resulting tar archives into "split-android" folder, naming them by applicationId.
- Repeat until all "subtar(s)" are extracted

3) Usage:
3.1) java -jar tar-bin-split.jar <-split-subtar> <archive.tar>
	* Output files go into "split-subtar" folder
3.2) java -jar tar-bin-split.jar <-split-android> <archive.tar>
	* Output files go into "split-android" folder

Naming:
- "subtar" is each part of a tar archive that is valid as a tar file on its own, and can be extracted and operated individually by a tar program like GNU Tar or star.
- "linkflag" is a char inside the header of each "subtar" that contains additional information about special headers and long filenames. It is at offset 156.
- "item" is the data that is extracted from each "subtar", in other words, the archive or directory or link that is generated when extracting such tar archive with a tar archiver.
- "offset" is the position where a char or data begin, and is counted relative to the beginning of each "subtar".
- "applicationId" is the unique name that each android app is given in the Google Play Store, which differs from the display name (may depend on language).
- "adb backups" are backups of android apps or android internal storage that need to be dumped to a computer using the Android Debugging Bridge. It's the only official way to make and
	restore backups on android, although is far from perfect. Some data is not backed up depending on the way each app is programmed. Also, settings for the device are not backed up
	and it's not guaranteed that adb backups are interchangeable between different devices or future releases. See Android Backup Extractor for more information.

Considerations:
- Compiled with Compiler compliance level: 1.6 (Java 6 or higher)
- Only one input archive can be handled at a time
- Some files inside the backup are empty files or folders.
- Folders have size 0, and some files too.
- A block of 1024 null bytes on a tar will mean end of file, and further data in the tar will be discarded. Take notice when appending archives in binary mode.
- Third party libraries added:
	* org.apache.commons.compress
	* org.apache.commons.io
	* org.tukaani.xz

Changelog:
- v1.0
	* Initial version: separate tar archive into individual tars when only standard header is present.
- v1.1
	* Detect end of filesize data also with space and not only with null character.
- v2.0
	* Remove old and unused code
	* Improve this README file
	* Now read the main tar filename from command line
	* Now use org.apache.commons.compress.archivers.tar to fully detect the beginning and end of each subtar inside the main tar archive.
		It had to be done this way since there are different extensions and expansions to the basic tar format.
	* public TarArchiveEntry getNextTarEntry() was splitted in two to be able to detect the beginning of the next subtar, otherwise very difficult.
		These two functions were created inside /Tar Binary Splitter/src/org/apache/commons/compress/archivers/tar/TarArchiveInputStream.java
			+ public boolean getNextTarEntry_1_of_2_docontinue()
			+ public TarArchiveEntry getNextTarEntry_2_of_2()
- v2.1
	* Replaced "tar_ball.tar" with maintarfile
- v3.0
	* RandomAccessFile "in" changed to read-only instead of read/write (not needed)
	* Modified lines 731, 732, 741 and 742 of TarArchiveEntry.java to rely only on linkFlag for detection of LF_GNUTYPE_LONGLINK and LF_GNUTYPE_LONGNAME
	* Use -split-subtar as command line option to separate subtars
	* Replaced split-out with split-subtar
	* Replaced -split with -split-subtar
	- Use CHUNK_SIZE in split_subtar() to manage big files and prevent java.lang.NegativeArraySizeException and java.lang.OutOfMemoryError
- v4.0
	* Create new option -split-android to split an android adb backup (already in tar format) by android app or shared storage.
	* Use ArrayList to delete files in split-android folder before extracting the new one (or it will append)
	* Improved exit codes for better troubleshooting. Only 0 means everything right.
	* Improved README.TXT
- v4.1
	* Created usage() and move there the improved usage message
	* Improved README.TXT

TODO: fix "Hard EOF on input, first EOF block is missing" when extracting subtars with star, due to minimum trailing null characters on each subtar (truncated).
GNU Tar should work in any case. Not important. Having 1024 null bytes at the end of each subtar works.
Requires a whole empty block of 1024 bytes. Tar archive multiple of 10240 (optional).
