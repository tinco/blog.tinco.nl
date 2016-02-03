---
layout: post
title: NixOS on Digital Ocean
summary: Demonstration of the power of NixOS by deploying a service on Digital Ocean
---

You are a system administrator or devops person looking
to automate the deployment of a website, a service or an application
either somewhere on the cloud or on a private server. You might have
experience with or at least looked at some tooling like *Chef*, *Puppet* or *Ansible*.
Those tools will get your configuration encoded and deployed, but they all
have some serious maintenance problems. Often its easier to just wipe
a machine clean and run the configuration from scratch than to accumulate
migrating cruft in your scripts.

## A friendly wager
NixOS is a Linux distribution with configuration management baked right into the core. 
Being designed by those pesky technically superior Haskell people, it's easy to dismiss
it as one of those experimental small time distros that stand no chance in the real world.
But I'll wager you the following:

*Once you get the idea of NixOS you'll hope to never use other configuration 
management tools again.* 

## Setting it up
I won't spend too much time on convincing you with theoreticals, let's just get 
past the first major hurdle. Using NixOS means you have to abandon your Linux distribution
of choice. No more Debian, CentOS, Ubuntu or even Archlinux. NixOS is a total 90 degree
turn from the traditional operating systems, the philosophy just isn't compatible so
forget about the idea of maybe porting the concepts to the distribution you swore your
heart to.

To make this demonstration nice and comfortable, we'll go with deploying on Digital
Ocean. You can skip the following few steps if you already have a VM with NixOS installed
somewhere.

First, provision a *new* 1GB RAM 64-bit Ubuntu *15.10* droplet in your datacenter of choice. Make sure your
ssh public key is installed so you can easily log into it over SSH. Do so as root and execute the
following commands:

~~~ bash
 apt-get install -y squashfs-tools unzip
 wget https://github.com/tinco/nixos-in-place/archive/master.zip
 unzip master.zip
 cd nixos-in-place-master
 ./install -d
~~~

It will ask for confirmation, press y to continue and its off. After a few minutes if everything
went well the script will ask for your root password, enter it and confirm to reboot.

So what just happened? An excellent tool written by [jeaye](https://github.com/jeaye/nixos-in-place)
downloaded and installed NixOS next to the Ubuntu installation and then modified the boot sequence
to boot into NixOS instead of Ubuntu.

## Making yourself at home

Now ssh back into your machine, you will have to clean the old machine out of your `.ssh/known_hosts` file,
 run `nano /etc/nixos/configuration.nix` and have a look around. The system you are logged into is
 fully described by this file (and the `.nix` files it references). 

First lets make our environment nice and comfortable, the default NixOS configuration is very bare.
You can start by uncommenting the line `# networking.hostName = ..` and giving it a name you like. I
like to give it a boring name like `nixos-1gb-ams3-1` but you can get creative. I can also recommend
getting the `i18n` and timezone settings set right so you'll feel right at home.

Then let's perform our first piece of magic: package management. On NixOS any user can install
their own packages without bothering anyone else, but I like it when there's a few more packages
installed on the system per default. To get my favourite packages installed find the part that
looks like this:

~~~
  # environment.systemPackages = with pkgs; [
  #   wget
  # ];
~~~

And change it to look like this:

~~~
  environment.systemPackages = with pkgs; [
    wget
    vim
    tmux
    git
    which
  ];
~~~

Save the file by hitting ctrl+o and then exit with ctl+x. Did you get everything perfectly right?
Now is the moment of truth, but not to worry, we'll first test our brand spanking new configuration.

Run `nixos-rebuild test`. If you made a syntactic error, it will tell you right away. If you referenced
a package that doesn't exist, or made a configuration that doesn't make sense it will think for a little
and then tell you. If you got everything right then it will proceed and fetch and install packages to
the `/nix/store` and activate the new configuration. Made a horrible mistake? No matter, recovery is
just a reboot away. `nixos-rebuild test` will activate your configuration, but will not actually commit
the new configuration to grub. That means when you reboot your machine will be exactly like it was before
you did `nixos-rebuild test`. When you're happy with what you did, simply run `nixos-rebuild switch` and its
set in stone.

Lets say we've suddenly became absolute cURL fanatics and really don't like wget. Lets open up the `configuration.nix`
file again and remove the `wget` line, save it and run `nixos-rebuild switch`. Now try `which wget`... it's not there anymore!
The configuration file does not only specify what files should exist, it also specifies that everything not in the configuration
should *not* exist. It can't get cleaner than that.

## Getting a service going

So that's package management, but how about configuration management? Let's quickly configure a service.
It will be an nginx web service inside a docker container managed by systemd. Add the following lines below the line that mentions `openssh`:

~~~
  virtualisation.docker.enable = true;

  systemd.services.myWebService = {
    wantedBy = [ "multi-user.target" ];
    after = [ "docker.service" ];
    requires = [ "docker.service" ];
    serviceConfig = {
       ExecStart = ''${pkgs.docker}/bin/docker run --rm --name nginx -p 80:80 nginx'';
       ExecStop = ''${pkgs.docker}/bin/docker stop -t 2 nginx'';
    };
 };
~~~

Save the file and run `nixos-rebuild switch`. It will run install docker and its dependencies. Build the
systemd unit as you specified. Systemd will proceed to run docker and subsequently the `myWebService` unit.
You can track its progress by running `systemctl status myWebService`, it will first have to download the
image and its layers so it might take a little while but when it's done visit your droplets IP address and
see the wonder that is the nginx welcome page. 

Hate Docker and/or the nginx welcome page? Simply remove the lines you just added and run `nixos-rebuild switch`
again. It will clean everything up and when it's done the service will have exitted and docker will be removed.

That's the future of configuration management.

