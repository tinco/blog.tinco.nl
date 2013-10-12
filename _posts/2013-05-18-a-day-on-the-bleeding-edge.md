A day on the bleeding edge
==========================

I don't like old software, in fact I really hate it and I think we should `rm -rf` it all. But that's just my extremist view. Because of this view some time ago I decided I should forego Debian and install Arch Linux on my server ( I know, sysadmins are face palming at me ). This post is an account of how a day sometimes goes when you're really pushing the boundaries of bleeding edge software.

So there's this software for synchronising your data between multiple machines and the cloud called git-annex. Basically it keeps track of your files metadata in a git repository and moves and copies the files around as you see fit, sort of like dropbox but with a lot more control, you should check out his blog for more details. I figured I would give it a try for synchronising my documents and pictures, which I had been backing up by simply copying them from machine to machine every once and a while, a rather dodgy practice.

On OSX
------------
Installing git annex on my laptop wasn't much of a problem, I run OSX there and  there is a binary you can download and run, no problem. I used the web interface to mark my `~/Documents` folder as a git-annex repository. That was step 1. 

Step 2 is creating a remote repository to back it up to. There's a special kind of repository for backups called a 'bup', which is what I'm going to use. This didn't seem to be working in the webinterface yet so here comes the first terminal command:

    /Applications/git-annex.app/Contents/MacOS/git-annex initremote tinco.nl type=bup encryption=mail@tinco.nl buprepo=tinco.nl:/srv/bup/documents

Simple, it makes a repository of the bup type on my server. But ofcourse the command fails, I seem to be missing GPG. Not a problem, I'll just install it through homebrew. Haven't installed that yet, no problem just execute this line from their homepage:

    ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)" 

That fails, obviously, because I haven't installed XCode Command Line Tools yet. The Command Line Tools is just the compiler toolchain for OSX. To install it, you have to download XCode from the Apple App Store. This takes half an hour, then when you've got it installed you go to the downloads menu in the preferences and select Command Line Tools, it goes off to download and install them. So about an hour later you have your LLVM compiler all set up and ready to go. You run the command again, find out you have to agree to the XCode license first, hit space a bunch of times and then type 'agree', then hit space a bunch of time for another eula and type 'agree' again. Finally the command `brew doctor` tells us we're good to go. A simple `brew install gpg` does the trick, and `gpg --import tinco.gpg` installs my public key into the database.

The server
---------------
After running the git-annex command again we get another error. This time it's about the server, it doesn't have git-annex installed.

On Arch Linux, when something is tested and accepted into the core repositories it can be installed with the command `pacman -S package-name`. In this case it isn't so simple, the git-annex system is very new and hasn't been packaged for Arch Linux yet, but it does have a Cabal package.

Cabal is a build system for Haskell projects that can fetch project sources and their dependencies from an online repository, and compile and install them. To get this tool we execute a pacman command pulled from the Arch Linux documentation on the git-annex website.

    pacman -S git rsync curl wget gnupg openssh cabal-install

This installs cabal-install and a bunch of dependencies, but we will soon find out not all of them. After it is done we can execute the cabal installation command, also from the documentation.

    cabal install git-annex --bindir=$HOME/bin

The bindir parameter assumes you have `$HOME/bin` in your `$PATH`, which is a cool thing to have, but I suspect good sysadmins put their cabal bins in a cabal specific bin dir, and add that to the path, I also suspect that is what cabal does by default. Unfortunately things become less rosy from here. The command first fails with a cryptic error: "The pkg-config package gnutls is required but it could not be found." Some quick research shows that pkg-config manages package dependencies in a cross platform way for cabal and we need to install gnutls and sasl through pacman. Fair enough, but then a more awkward pkg-config error. We need c2hs, a Haskell project that generates haskell bindings for C projects, it is a pkg-config dependency implying we need to install it through pacman, but pacman does not have a c2hs package.

For this sort of problem Arch Linux has the AUR. The AUR is a repository of user contributed package build files. A package build file is basically a script that compiles a project, and then tars the built project into a package that can be installed onto your system using the pacman tool. 

Since these package build files are contributed by regular users and not checked by verified package maintainers but do contain code that eventually is ran as root, it is important that you check carefully what each file does exactly. Since making and installing these packages is a cumbersome process of downloading and extracting build files, inspecting them, running then and passing them on to pacman it is recommended to install the yaourt tool to automate the repetitive parts of this process.

Yaourt is itself a project in the AUR. It has one dependency, package-query, which also has one dependency, yajl, that fortunately is in pacman. The process goes as follows.

First yajl:
    pacman -S yajl
Then package-query:
    wget https://aur.archlinux.org/packages/pa/package-query/package-query.tar.gz
    tar -xvzf package-query.tar.gz
    cd package-query
    makepkg
    pacman -U package-query-1.2-2-x86_64.pkg.tar.xz
    cd ..

And then yaourt:
    wget https://aur.archlinux.org/packages/ya/yaourt/yaourt.tar.gz
    tar -xvzf yaourt.tar.gz
    cd yaourt
    makepkg
    pacman -U yaourt-1.3-1-any.pkg.tar.xz

So then I'm ready to use yaourt to install c2hs. I run `yaourt -S c2hs`, it asks if I want to edit the pkgbuild, I say yes and give it a cursory look. It seems fine and I exit the editor and tell yaourt I want to continue. It gives an error that it can not find the dependency `language-c' version 3. A quick look in AUR reveals that language-c version 4 is in the AUR. Time to customise the pkgbuild file.

To update the dependency, I downloaded the language-c source code from hackage, and then ran `sha256sum language-c-0.3.2.1.tar.gz` copying the output to the clipboard. After that I ran the yaourt command for installing the language-c package. I edit the pkgbuild file, replacing the version number and the sha256 sum on the clipboard. Now I try to run install the c2hs package again, this time the build starts, but exits with a compilation error. I look on Hackage and discover that there's a version 16.4 of the c2hs project, can't hurt to try using that instead so I download the source, run it through sha256sum and rerun the yaourt command, this time editing the pkgbuild and updating the pkgversion to 16.4, and replacing the sha256sum. Now it installs. We're almost there!

I run the `cabal install git-annex` command again and it starts compiling. Somewhere towards the end it exits with the cryptic message 'ExitFailure 9' a quick google yields the reason, cabal received a SIGKILL from the kernel, likely because it was using too much memory. I check the output of mount, and notice I have no swap mounted. Making swap is not difficult, just these three commands ran as root:

    dd if=/dev/zero of=/swap bs=1M count=1024
    mkswap /swap
    swapon /swap

They make a swap file by reading 1024 blocks of 1 megabytes of zeroes from /dev/zero and writing them to /swap, then formatting the file as a swap file and finally enabling the swap file. Running the cabal install again and finally it finishes without problems.

Update
------
I never uploaded this blogpost because at this point I realised I had missed something stupid and it could have been done in a much simpler way. I forgot what way that was, so I'll just leave this post here as a short story about things that can go wrong when deploying software.
