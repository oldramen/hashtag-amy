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
if (mWaiter) require("./menu.js");
if (mTwitOn) global.mTwit = require("twit");
if (mUseLastfm) global.mLastfmNode = require("lastfm").LastFmNode;

Log("Initializing");
//Let's set some constant variables.

global.mCurrentSong = {
	songName: "",
	upVotes: -1,
	downVotes: -1,
	heartCount: -1
}

global.mUsers           =   {length: 0};
global.mDJs             =   [];
global.mCurrentDJ       =   null; /// Will be a user ( type )
global.mRecentlyLeft	=	{};

global.mRoomName        =   "";
global.mRoomShortcut	= 	"";
global.mMaxDJs          =   5;
global.mDJDropTime		= 	Date.now();

global.mLoopInterval	= 	null;
global.mParsing         =   {};
global.mMongoDB         =   null;
Log("Loading up with the Auth ID: " + mAuthId + " and userid: " + mUserId + " into roomid: " + mRoomId);
global.mBot             =   new mTTAPI(mAuthId, mUserId, mRoomId);
global.mBooted          =   false;
global.mIsModerator     =   false;

global.mBareCommands    =   mCommands.filter(function(e){ return e.bare == true; });
if(!mBareCommands) mBareCommands = []; else mBareCommands = mBareCommands.map(function(e){ return e.command; });;

global.mPMCommands    =   mCommands.filter(function(e){ return e.pm == true; });
if(!mPMCommands) mPMCommands = []; else mPMCommands = mPMCommands.map(function(e){ return e.command; });;

global.mQueue           =   [];
global.mQueueNextUp     =   null;
global.mQueueWarned     =   [];
global.mQueueNotified   =   false;
global.mQueueTimeout	= 	null;

global.mTimeForSpin		=	false;
global.mLottoClaimed	=	null;

global.mJustRemovedDJ   =   [];
global.mReservedSpots	= 	[]; /// [{timestarted, userid}];
global.mLottoHolders	=	[];

global.mQueueCurrentlyOn        = false;
global.mSongLimitCurrentlyOn    = false;
global.mAFKLimitCurrentlyOn		= false;
global.mCurrentSongLimit        = mMaxSongs;
global.mUsingLonelyDJ			= false;
global.mNoGo					= null;
global.mPmOverride				= false;

global.mAFKWarn = mAFK * (0.693148);

global.mPushingOutGreeting      = [];
global.mSpokenMessages          = [];
global.mPMQueue					= [];
global.mBootedQueue				= [];
global.mSaving					= false;

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
mBot.on("endsong", OnEndSong);
mBot.on("snagged", OnSnagged);
mBot.on("nosong", OnNoSong);
mBot.on("update_votes", OnVote);
Log("Done");

if (mTwitOn && mTwitKey) {
	Log("Connecting to Twitter");
	global.mTwitter = new mTwit({
	    consumer_key:         mTwitKey
	  , consumer_secret:      mTwitSecret
	  , access_token:         mTwitToken
	  , access_token_secret:  mTwitTokenSecret
	});
	global.mLastTweeted = null;
	Log("Done");
};

if (mUseLastfm) {
	Log("Connecting to Lastfm");
	global.mLastfm = new mLastfmNode({
		api_key: mLastfmKey, 
		secret: mLastfmSecret
	});
	Log("Done");
}