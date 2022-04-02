---
title: "Move current selection to new folder with Applescript"
date: 2009-05-27
author: harmen-janssen
url: /articles/60/move-current-selection-to-new-folder-with-applescript
---

<p>I often want to instantly move a selection of files into a newly created folder. The scenario is this: I select a bunch of files in Finder, click a button and *bam*: a new folder is created in the current location containing my selection.</p>
<p>This cannot be done natively, but I wrote an Applescript that does this for me.</p>

---

Here's the complete script:

```
tell application "Finder"
	try
		set theLocation to folder of front window
		set newFolder to make new folder at theLocation with properties {name:"New Folder"}
		move selection to newFolder
		set selection to newFolder
	end try
end tell
```

It's a very simple script, but here's a rundown of what it does:

```
tell application "Finder"
	...
end tell
```

This line tells Applescript I want to talk to the application "Finder".

```
tell application "Finder"
	try
		...
	end try
end tell
```

If something goes wrong in the script (for instance, when no Finder window is opened), the `try` block ensures no ugly error message pops up.

```
tell application "Finder"
	try
		set theLocation to folder of front window
		set newFolder to make new folder at theLocation with properties {name:"New Folder"}
		...
	end try
end tell
```

The next two lines save the location of the folder of the top Finder window in a variable, and create a new folder inside that one named "New Folder".

```
tell application "Finder"
	try
		set theLocation to folder of front window
		set newFolder to make new folder at theLocation with properties {name:"New Folder"}
		move selection to newFolder
		set selection to newFolder
	end try
end tell
```

The last two lines move the current selection of files to the newly created folder and select the folder (for easy access, if you want to change its name for instance).

That's it! You can save this script as an `.app` and drag it into your Finder toolbar so you can access it directly from Finder.

Let me know if you got any improvements!

