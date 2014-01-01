---
layout: post
title: A reading of Wayland
summary: In which I read the source code of Wayland, a WIP.
---

As some people might know: I don't like old software at all. So I'm all too eager
to ditch X and use whatever will replace it. I've long been interested in Wayland,
but recently Ubuntu has started working on another alternative called Mir.

There are people who question Ubuntu's motivations in launching their own alternative.
They care about the Linux (and open source in general) eco system and what effects two
X alternatives might have on it. They wish Ubuntu had just adopted Wayland and deliver
the final death blow to X in a cooperative and concentrated effort.

I am not one of those people, I don't think about politics and social efforts too much,
I just want to see cool well written software. So I do what any sane person would do:
Look at the source code, and determine which project I like better from that.

Architecture
-----------

Wayland has a nice simple website at wayland.freedesktop.org that has some nice pages
that explain what the project is about and why it's better than X. I won't go too deep
into this now, I'll just give a quick description about what the architecture is like.

The basic idea is that Wayland is a protocol for a compositor to receive input from kernel
drivers and to manage buffers for compositor clients. Weston is the reference implementation
of the protocol. It is in charge of deciding which input events are dispatched to which
clients. It also keeps track of buffers supplied by the clients and decides where and how to
draw those. Clients make buffers, supply references to those buffers to the compositor and
tell the compositor whenever the buffers have new content.

All in all it sounds like a pretty simple but powerful protocol, let's look at the implementation.

Checking it out
--------------

The source is split up into two git repositories. Wayland the protocol defines the protocol libraries
and Weston the compositor which uses those libraries to implement a compositor. We'll look at the
protocol repository first.

### The wayland libraries

## Compilation
The readme promises an easy compilation, it points to the building manual which has you define
a few extra environment variables. Because it's a C project you need to have installed the standard build
tools which on Ubuntu are in the build-essential package. In addition to that you also need to install
autoconf and libtool, unfortunately those are not documented dependencies. If you want documentation you
also need to install doxygen, if not you can supply the `--disable-documentation` flag to your autogen.sh
invocation. After the autogen invocation the `make` and `make install` work without a hitch and are very
fast, so all in all it was a pretty easy compilation.

## The source

The libraries are written in C, which is the default choice for this sort of low level software. I was
positively surprised when I saw the directory layout. The source is in only one directory (`src/`) and
has only ~15 `.c` and `.h` files that have filenames that look short and descriptive to me.

Since this is a library project it won't have a very distinctive entry point. Instead we will look first
at the header files, since these are the ones important to any project looking to make use of the library.
The header files all are below 500 lines, most well below. Most functions are short with descriptive names,
all prefixed with `wl_`. I don't like the lack of structure C has in general, but this looks like about
as clean as C can be. There is a fair amount of documentation, mostly for non-trivial or important functions.

All in all the source looks like there's no crazy stuff going on. There's an event loop implemented 
in under 500 lines, and the connection system in slightly over a thousand. This looks like a project anyone
could just jump into and contribute.

### The weston compositor implementation

