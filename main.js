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
global.mBot         =   new mTTAPI(global.mAuthId, global.mUserId, global.mRoomId);
Log("Done");

Log("Hooking events");
mBot.on("registered", OnRegistered);
mBot.on("deregistered", OnDeregistered);
Log("Done");