A day on the bleeding edge
==========================

I don't like old software, in fact I really hate it and I think we should `rm -rf` it all. But that's just my extremist view. Because of this view some time ago I decided I should forego Debian and install Arch Linux on my server ( I know, sysadmins are face palming at me ). This post is an account of how a day sometimes goes when you're really pushing the boundaries of bleeding edge software.

So there's this software for synchronising your data between multiple machines and the cloud called git-annex. Basically it keeps track of your files metadata in a git repository and moves and copies the files around as you see fit, sort of like dropbox but with a lot more control, you should check out his blog for more details. I figured I would give it a try for synchronising my documents and pictures, which I had been backing up by simply copying them from machine to machine every once and a while, a rather dodgy practice.

The laptop
--------------
Installing git annex on my laptop wasn't much of a problem, I run OSX there and  there is a binary you can download and run, no problem. I used the web interface to mark my `~/Documents` folder as a git-annex repository. That was step 1. 

Step 2 is creating a remote repository to back it up to. There's a special kind of repository for backups called a 'bup', which is what I'm going to use. This didn't seem to be working in the webinterface yet so here comes the first terminal command:

    /Applications/git-annex.app/Contents/MacOS/git-annex initremote tinco.nl type=bup encryption=mail@tinco.nl buprepo=tinco.nl:/srv/bup/documents

Simple, it makes a repository of the bup type on my server. But ofcourse the command fails, I seem to be missing GPG. Not a problem, I'll just install it through homebrew. Haven't installed that yet, no problem just execute this line from their homepage:

    ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)" 

That fails, obviously, because I haven't installed XCode Command Line Tools yet. The Command Line Tools is just the compiler toolchain for OSX. To install it, you have to download XCode from the Apple App Store. This takes half an hour, then when you've got it installed you go to the downloads menu in the preferences and select Command Line Tools, it goes off to download and install them. So about an hour later you have your LLVM compiler all set up and ready to go. You run the command again, find out you have to agree to the XCode license first, hit space a bunch of times and then type 'agree', then hit space a bunch of time for another eula and type 'agree' again. Finally the command `brew doctor` tells us we're good to go. A simple `brew install gpg` does the trick, and `gpg --import tinco.gpg` installs my public key into the database.

The server
---------------
After running the git-annex command again we get another error. This time it's about the server, it doesn't have git-annex installed.
