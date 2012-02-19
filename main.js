/*
    Copyright 2012 yayramen && Inumedia.
    This is the file that brings all the other files together,
    and makes them play nicely. :D
*/
console.log(mName+" >>> Loading.");

global.mFunctions   =   require("./functions.js");
global.mTTAPI       =   require("ttapi");
global._            =   require("underscore");
global.mMongo       =   require("mongoskin");
global.mReadLine    =   require("readline");
global.mUtil        =   require("util");

Log("Initializing");
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
global.mGreetings   =   Refresh("greetings");
Log("Done");

Log("Hooking events");
mBot.on("registered", OnRegistered);
mBot.on("deregistered", OnDeregistered);
Log("Done");

Log("Ready!");