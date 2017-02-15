SJA UTManager is a simple node.js program that organizes all your screenshots, demos, it also converts cache files so you can now use these files downloaded from servers, in offline matches.


Requires:
- Node.js

How to use:
- Place main.js into your Unreal Tournament System folder.
- Open the command prompt.
- type "node main.js"
or
- Create a .bat file in the unreal Tournament System directory (run.bat)
- Write "node main.js" (without the quotation marks) and the save.
- Double click run.bat.

Examples of what it does:

Both:
- If the tool directories don't exist, then it will create the directories below,
- Creates a folder called "SJA UTManager" in the UT system directory,
- Creates a folder called "Screenshots" in the SJA UTManager directory,
- Creates a folder called "Demos" in the SJA UTManager directory.

Demos:
- Finds test.dem (Created 12.12.17 18:23)
- Creates a directory called 2017-12-12 in the directory SJA UTManager/Demos, if it doesn't already exist,
- Makes a copy of test.dem and place it in the directory SJA UTManager/Demos/2017-12-12/,
- Deletes the original file in the system directory.

Screenshots:
- Finds Shot0001.bmp (created 01.07.09 12:37),
- Creates a directory called 2009-07-01, if it doesn't already exist,
- Makes a copy of Shot0001.bmp and moves it to the directory SJA UTManager/Screenshots/2009-07-01/
- Deletes Shot0001.bmp from the system directory.
