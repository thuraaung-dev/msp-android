This small java application intends to extract the contents of a Helium (formely Carbon) backup.
Helium backups are normal adb backups created with boolean COMPRESS_FULL_BACKUPS = false, and the 18th byte
of the backup changed from 0 to 1 (I guess this is done by Helium intentionally).
Android should be able to restore helium backups properly, considering that first you change 18th byte from 1 to 0.
The files inside uncompressed backups don't necessarily match directly the ones in compressed format (even after decompression).
The program creates an apps folder where you are running the jar.

It requires java and can be used this way:
java -jar hbe.jar -tar helium-backup.ab
java -jar hbe.jar -force helium-backup.ab

Naming:
- backup refers to the helium backup ending in .ab
- file refers to each item present inside the backup and that is extracted independently

The source code operates this way:
- Skip first 31 characters, which belong to adb backup header plus tar header
- Read the name of a file
- Read the size of that file from tar header, if tar method is selected; skip if force method is selected
- Get data with the size specified on header, if tar method is selected; read until next filename otherwise
- Go on if there are more files inside the helium backup
- Last 4 characters of the backup are not needed

Considerations:
- This program only works with unencrypted and decompressed backups.
- Uncompressed backups are the ones that data goes directly is some tar formar just after the adb header.
- Compressed backups are the ones that tar goes through Java Deflater with the best compression, however doesn't require password.
- Encrypted backups are the ones that require password, and may be or not compressed (I guess).
- File size in written in octal in the backup. It's converted to decimal to operate better.
- Sometimes the header has incorrect size for a file, which is to say BackupManagerService.java is generating it that way.
There's no solution to workaround this. 
- Tar method relies only on headers, so extraction may crash if it's not correct all the time.
- Force method reads all data from a file to the next and trims null characters. This method works much better than the tar method for this reason, 
however starting and trailing null characters are removed while on some files like databases should be there. It's impossible to detect it if header is wrong.
- 
- Some files inside the backup are empty folders. If then there's a regular file there the program overwrites the folder with the file.
- Folders have size 0, and some files too.