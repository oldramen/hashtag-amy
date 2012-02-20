/*
    Copyright 2012 yayramen && Inumedia.
    This is the file that brings all the other files together,
    and makes them play nicely. :D
*/
console.log(mName+" >>> Loading.");

//Let's require all the files to make the bot work.
global.mFunctions   =   require("./functions.js");
global.mTTAPI       =   require("ttapi");
global._            =   require("underscore");
global.mMongo       =   require("mongoskin");
global.mReadLine    =   require("readline");
global.mUtil        =   require("util");

Log("Initializing");
//Let's set some constant variables.
global.mUsers       =   [];
global.mAFKTimes    =   [];
global.mSongName    =   "";
global.mUpVotes     =   0;
global.mDownVotes   =   0;
global.mDJs         =   [];
global.mCurrentDJ   =   "";
global.mModerators  =   [];
global.mIsModerator =   false;
global.mRoomName    =   "";
global.mMongoDB     =   null;
global.mBot         =   new mTTAPI(global.mAuthId, global.mUserId, global.mRoomId);
InitMongoDB();
Refresh("greetings", function(e,pItems){ 
    if(!pItems) return;  
    global.mGreetings = pItems;
});
Refresh("owners", function(e,pItems){ 
    if(!pItems) return;  
});
Refresh("vips", function(e,pItems){ 
    if(!pItems) return;  
});
Log("Done");

Log("Hooking events");
//Now we're going to start hooking some events.
mBot.on("registered", OnRegistered);
mBot.on("deregistered", OnDeregistered);
mBot.on("new_moderator", OnNewModerator);
mBot.on("rem_moderator", OnRemModerator);
mBot.on("add_dj", OnAddDJ);
mBot.on("rem_dj", OnRemDJ);
mBot.on("speak", OnSpeak)
Log("Done");

Log("Ready!");