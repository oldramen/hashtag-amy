console.log(mName+" >>> Loading.");

global.mFunctions   =   require("./functions.js");
global.mBot         =   require("./bot.js");
global.mTTAPI       =   require("ttapi");
global._            =   require("underscore");
global.mMongo       =   require("mongoskin");
global.mReadLine    =   require("readline");
global.mUtil        =   require("util");

Log("Initializing");
global.mUsers       =   [];
global.mAFKTime     =   [];
global.mAmy         =   new mTTAPI(global.mAuthId, global.mUserId, global.mRoomId);
Log("Bot setup");

Log("Hooking events");
mAmy.on("registered", OnRegistered);
mAmy.on("deregistered", OnDeregistered);