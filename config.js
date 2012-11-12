/*
    Copyright 2012 yayramen && Inumedia.
    This is the config file, where the variables for the bot are stored.
    You can have multiple config files, and run multiple bots with the 
    same source files.
*/
//Bring in the responses
require("./enums.js"); //ignore this


//Main Authorization Information
global.mAuthId                  = "{auth_id}";//authid of bot
global.mUserId                  = "{user_id}";//userid of bot
global.mRoomId                  = "{room_id}";//roomid of room to be hosted in

//Database Information
global.mMongoHost               = "{mongo_host}";//host of mongodb, usually localhost or 127.0.0.1
global.mMongoDatabase           = "{mongo_database}";//mongocollection for bot.
global.mMongoUser               = "{mongo_user}";//user of mongocollection
global.mMongoPass               = "{mongo_pass}";//password to mongocollection
global.mMongoPort               = 27017;//Port, this is default

//General Information
global.mName                    = "DubbyTT";//name of bot [if bot's name is different, this will change it.]
global.mLaptop                  = "chrome";//Laptop the bot will use if the bot decides to DJ (lonely dj, /song)
global.mTheme                   = "Play whatever you want, but it better be good like -> :elephant::dash::sparkles::heart::sparkles::yellow_heart::sparkles::green_heart::sparkles::blue_heart::sparkles::purple_heart:";//default theme/genre for the room

//Announcements
global.mLastUpVote				= null;			//Last up vote count
global.mLastDnVote				= null;			//Last dn vote count
global.mAnnounceLamers			= false;		//Whether or not the bot announces who's laming songs

//User Arrays [ignore mModerators]
global.mOwners					= ['4fde9255aaa5cd1e680004f8','4e6498184fe7d042db021e95'];//array of userids for who's an owner of the room.
global.mAmyBotID				= "4ec85624a3f7514594000593"; //ID of Inumedia's #Amy

//Hardcoded blacklist... it just kicks the shit out them right away
global.mBlackList         = ['123456789012345678901234','123456789012345678901234'];

global.mVIPs					= [];//array of userids for who's a VIP.
global.mBANs					= [];//array of userids for who's BANNED.
global.mWhiteList				= [];//array of userids for whitelist.
global.mModerators				= [];//array of userids identified as moderators [dynamically generated, leave blank]

//Song Limits
global.mLimitOn                 = false;	//If songs limits are on by default
global.mMaxSongs                = null;  	//How many songs you can play
global.mWaitSongs               = null;     //How many songs you must wait after hitting limit to dj again
global.mMinSongLimitOperator    = null;     //Whether song limits are dynamically generated null by default
global.mMinUsersForSongLimit    = null;     //How many users have to be in the room to auto turn on song limits
global.mMinDJsForSongLimit      = null;   	//How many DJs have to be on deck to auto turn on song limits
global.mSongLimitUserProportion = 250;      //5 songs per 50 people in the room.

//Lotto System
global.mLottoOn					= false;	//Whether or not the next DJ is selected via a lottery
global.mLottoTime				= 30;		//How long (in seconds) that users can /spin after a DJ drops
global.mLottoHoldTime			= 30;		//How long (in seconds) the bot will hold the dj spot for the lotto winner

//Room Queue
global.mQueueOn                 = false;  	//If room queue is on by default
global.mMinQueueOperator        = false;	//Whether queue is turned on dynamically
global.mMinUsersForQueue        = 4;	    //How many users must be in the room to auto turn on the queue
global.mMinDJsForQueue          = 4;	    //How many DJs must be on deck to turn on queue automatically
global.mQueueGrabSpotTimeout	= 30;		//How many seconds we should hold a spot for someone when they are next in the queue and there is an open spot.

//AFK Settings
global.mAFK                     = 30;     //How many minutes of AFK before you get booted
global.mWarn                    = true;  	//Should the bot warn users who are going afk?
global.mMinAFKLimitOperator		= "&&";		//Whether or not the AFK Limit is generated dynamically
global.mMinUsersForAFKLimit		= 10;			//Minimum users in the room before the AFK limit is turned on dynamically
global.mMinDJsForAFKLimit		= 3;			//Minimum DJs on deck before AFK limit is turned on dynamically
global.mAfkBop                	= false;  //Should bopping for a song reset that person's afk time?
global.mAntiIdleDetection		= false;	//Should we look for common phrases used in Anti Idle extensions?

//Lonely DJ
global.mLonelyDJ                = true;   //If true, bot will hop up to DJ if there is only one DJ [to prevent music cutoff]
global.mCheckAFKWithLonely		= true;	//Should we check to see if people are afk when they're using Lonely DJ?
global.mCheckSongCountWithLonely= false;	//Should we check the song count when they're using Lonely DJ?

//General Toggles
global.mWhiteListEnabled		= false;	//Whitelist is on ( true ) or off ( false )
global.mPMSpeak                 = false;  //Whether the bot will PM users so as to not spam
global.mPMCommands              = true;  	//Whether the bot will accept commands via PMs, without this it's kind of hard to make the bot /say things
global.mModBop                  = false;  //True, only mods can use the /bop command, false, anyone can.
global.mWaiter                 	= true;   //Whether waiter (/order) is enabled by default
global.mBotDJ               	= false;  //Whether the bot can dj on command
//global.mAutoBopForMods					= true;				//If we should automatically bop for mods and above.
global.mAutoBanBoots			= false;	//Instead of banning people, we simply boot them from the room.
global.mAutoBanOnTTLink			= true;		//Autobans someone from the room if they give a link to another room and joined < 1 minute ago
global.mAutoBanOnTTLinkTime		= 60000;	//If they post a link to a room on turntable within 60 seconds after joining the room, they will be banned. (60000=60 seconds.)
global.mDownVotesForOffGenre    = 3;
global.mHoldSpotForRefreshTime	= 120;		//The bot will hold a spot for 2 minutes per request if someone needs to refresh.
global.mMaxElapsedTimeForDJSpot	= 30000;
global.mIgnoreSongCountOpenSpot = true;		//If the time that the spot was open for is longer than mMaxElapsedTimeForDJSpot, that person will be allowed up if this is true.
global.mIgnoreSongCountOnLonely = true;		//If LonelyDJ is currently being used, the person will be able to get up if this is true.
global.mAutoBopForMods			= true;		//If we should automatically bop for mods and above.
global.bootTTStats				= false;	//If we should automatically boot TT Stats when they join the room.

//Twitter
global.mTwitOn					= false;	//Whether or not twitter functions are enabled
global.mModTwit					= false;	//If true, mods can tweet, if false, only owners can tweet
global.mTwitTimeout				= 20;			//How often [in minutes] the bot can tweet
global.mTwitKey					= "";			//Consumer Key for Twitter
global.mTwitSecret				= "";			//Consumer Secret for Twitter
global.mTwitToken				= "";			//Access Token for Twitter
global.mTwitTokenSecret			= "";			//Access Secret for Twitter

//Lastfm
global.mUseLastfm				= false;	//Whether or not we connect to lastfm
global.mLastfmKey				= "";			//Api Key for Lastfm
global.mLastfmSecret			= "";			//Secret for Lastfm

//Advanced
global.mSpeakingLevel           = Speaking.Debug;	//whether or not the bot talks without being prompted (greetings, dj announcements, etc.)
global.mNoSpamTimeout           = 3;              //3 seconds before the bot can say the same thing again.
global.mLoopTimeout             = 5;              //Does the main loop every 5 seconds.
global.mSaveTimeout				= 30;							//Saves everyone after 30 seconds.
global.mTimeForCacheFlush		= 15000;					//Time that the user stays in the cache after they leave.

//Let's start the bot then.
require("./main.js");
