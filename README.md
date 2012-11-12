# A Bot Named Amy

This bot runs on [node.js](http://nodejs.org/), usings Alain Gilbert's [ttapi library](https://github.com/alaingilbert/Turntable-API).  
It is currently in Development.

 - Room Management
 - Song Limits
 - Queue
 - DJ Whitelist
 - Bans
 - Twitter functions
 - Lastfm functions

### Everything Is Done, but Queue is buggy. 

### Note if you know what you're doing :D

While it makes sense to run ```node main.js```
we aren't normal, so you'll ahve to run ```node config.js```

# Setup Instructions

First things first: This is a guide, not a promise. I will not be able to help you set it up on your respective machine. With this guide, and 
the help of google, you should be able to manage it yourself. I do aplogize if this is an inconvenience for anyone.

## Step 1: Getting Dependencies
This bot uses Node.JS. You're going to need that in order to be able to do anything. Got to the [node website](http://www.nodejs.org/) and download
the latest version.

This bot also uses mongodb. This is a lightweight method of storing information. We have tried to make it toggleable as much as possible, but for the moment, a key feature still relies on it, so you'll need that too. You get it from [the mongodb site](http://www.mongodb.org/downloads).

## Step 2: Download ze bot
Next, you'll need a copy of the bot. [Download the zip](https://github.com/yayramen/hashtag-amy/zipball/master) and unzip it. Put the files someplace significant. For me, I put them in my home directory. 

## Step 3: Installing More Dependencies!
hashtag-amy requires node modules to work properly. So you'll need to grab a copy of npm. Google is your friend :D

Now the bot pretty much requires a terminal window. In OSX, it's Terminal.app. In Windows, go to Start -> Run -> and enter 'cmd'. In Linux, if you don't know, then you shouldn't be using linux, but you can just do Ctr-Alt-T.

Now cd into your directory. For me it's cd ~/hashtag-amy and run these commands:

    npm install ttapi
    npm install underscore
    npm install mongoskin

And hopefully I haven't forgotten one. If, later on, when you try to run the bot, you get an error saying 'can't find module blahblah'
just type in npm install blahblah

## Step 4: MongoDB
If you want the bot to work, you'll need mongodb. Google how to install it. Once you install it, I can give you a bit of help where linux is concerned.
In terminal/bash/cmd whatever, type "mongo databasename" - where databasename is the name you want your database to be.
Then type db.addUser("username", "password"). 
If you come up with an error, google it. If not, you're good to go.
In the config.js, fill out the information like this:

```
global.mMongoHost               = "localhost"; // or 127.0.0.1
global.mMongoDatabase           = "databasename";
global.mMongoUser               = "username";   
global.mMongoPass               = "password"
```

## Step 5: The Config File
Now it's type fill everyting out. Open config.js using your preferred file editor [I use Sublime Text 2 on Ubuntu, but I code a lot].

The config is written in javascript,so remember that you can break things by deleting things so don't :D.
Note: If it's not true/false/null or a number, it requires quotes "". 

You can view what most of them do [here](http://billing.yayramen.com/index.php/kb/documentation/turntable-fm-bot-config-documentation)

## Step 6: Running it.
Open up a terminal/command prompt, cd to where you put the files and type

    node config.js

If you did it right, you'll see #Amy load up. Once it says "Joined the room, booted up!" the bot should be in your room!

## Optional Step: Twitter Auth
I've included some twitter functionality.  
What it does is this: /tweet will tweet what song is playing and /tweet msg will tweet msg.  
First things first: install twit

```
npm install twit
```
I cannot reccomend enough that you use a brand new twitter account, as this has the potential for spam.  
After you have an account, go here: https://dev.twitter.com/apps/new and create a new app.  
Go to config.js to the 'twitter' section, and fill out the required fields.  

## Optional Step: Last FM
I've included some lastfm functionality as well, that allows you to get info about a current song in depth.  
You'll need to get an api and a secret from lastfm to do this, and you'll need to apply for an api account.  
You can do that [here](http://www.last.fm/api/account).  
Once you have an api and a secret, change mUseLastfm in config.js to 'true', and add your creds.  
This gives you access to /lookup [artist/genre/etc]  
You'll also need to:
```
npm install lastfm
```