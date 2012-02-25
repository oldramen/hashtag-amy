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
global.mCommandsMod =   require("./commands.js");

Log("Initializing");
//Let's set some constant variables.
global.mUsers           =   {length: 0};
global.mGreetings       =   [];
global.mBans            =   [];
global.mAFKTimes        =   {};
global.mParsing         =   {};
global.mSongName        =   "";
global.mUpVotes         =   0;
global.mDownVotes       =   0;
global.mSongCount       =   {};
global.mDJs             =   [];
global.mCurrentDJ       =   "";
global.mModerators      =   [];
global.mIsModerator     =   false;
global.mRoomName        =   "";
global.mMongoDB         =   null;
global.mBot             =   new mTTAPI(global.mAuthId, global.mUserId, global.mRoomId);
global.mBooted          =   false;
global.mMaxDJs          =   5;

global.mQueue           =   [];
global.mQueueNextUp     =   null;
global.mQueueWarned     =   [];
global.mQueueNotified   =   false;

global.mJustRemovedDJ   =   [];

global.mQueueCurrentlyOn        = false;
global.mSongLimitCurrentlyOn    = false;
global.mCurrentSongLimit        = mMaxSongs;

global.mPushingOutGreeting      = [];
global.mSpokenMessages          = [];

InitMongoDB();
Refresh("bans", function(e, pItems){
    if(!pItems) return;
    Log("Got Bans");
    for(var i = 0; i < pItems.length; ++i){
        mBans.push(pItems[i].userid);
        Log(pItems[i].userid);
    }
});
Refresh("greetings", function(e,pItems){ 
    if(!pItems) return;  
    Log("Got Greetings");
    global.mGreetings = pItems;
});
Refresh("owners", function(e,pItems){
    if(!pItems) return;
    Log("Got Owners");
    for(var i = 0; i < pItems.length; ++i) mOwners.push(pItems[i].userid);
});
Refresh("vips", function(e,pItems){
    if(!pItems) return;
    Log("Got VIPs");
    for(var i = 0; i < pItems.length; ++i) mVIPs.push(pItems[i].userid);
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
mBot.on("speak", OnSpeak);
mBot.on("pmmed", OnPmmed);
mBot.on("newsong", OnNewSong);
Log("Done");

Log("Ready");