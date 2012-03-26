/*
    Copyright 2012 yayramen && Inumedia.
    This is the config file, where the variables for the bot are stored.
    You can have multiple config files, and run multiple bots with the 
    same source files.
*/
require("./enums.js");

//This is where setup the streamers and shit for the party.

//Variables
global.mAuthId                  = "{auth_id}";      //authid of bot
global.mUserId                  = "{user_id}";      //userid of bot
global.mRoomId                  = "{room_id}";      //roomid of room to be hosted in
global.mMongoHost               = "{mongo_host}";   //host of mongodb
global.mMongoDatabase           = "{mongo_database}";//mongocollection for bot.
global.mMongoUser               = "{mongo_user}";   //user of mongocollection
global.mMongoPass               = "{mongo_pass}";   //password to mongocollection
global.mMongoPort               = 27017;
global.mName                    = "#Amy";           //name of bot
global.mLaptop                  = "chrome";
global.mTheme                   = "EDM";            //default theme/genre for the room

global.mSpeakingLevel           = Speaking.Debug;   //whether or not the bot talks without being prompted (greetings, dj announcements, etc.)

global.mOwners					= ['4e6498184fe7d042db021e95'];				//array of userids for who's an owner of the room.
global.mVIPs					= [];				//array of userids for who's a VIP.
global.mWhiteList				= [];				//array of userids for whitelist.
global.mModerators				= [];
global.mWhiteListEnabled		= false;			//whitelist is on ( true ) or off ( false )
global.mMaxSongs                = 3;                //default song limit
global.mWaitSongs               = 1;                //how many songs you must wait after hitting limit to dj again
global.mLimitOn                 = true;             //if song limits are enabled by default
global.mQueueOn                 = true;             //if queue is enabled by default
global.mAFK                     = 10;               //default afk time (in minutes)
global.mWarn                    = true;             //Whether bot warns for AFKs
global.mMinAFKLimitOperator		= "||";
global.mMinUsersForAFKLimit		= 10;
global.mMinDJsForAFKLimit		= 3;
global.mMinSongLimitOperator    = "||";             //Here ya go Dalton!  :D
global.mMinUsersForSongLimit    = 10;             	//TODO: This.
global.mMinDJsForSongLimit      = 3;   	          	//
global.mMinQueueOperator        = "||";	            //
global.mMinUsersForQueue        = null;	            //
global.mMinDJsForQueue          = 4;	            //
global.mSongLimitUserProportion = null;             //5 songs per 50 people in the room.
global.mNoSpamTimeout           = 15;               //15 seconds before the bot can say the same thing again.
global.mLoopTimeout             = 10;               //Does the main loop every 10 seconds.
global.mSaveTimeout				= 30;				//Saves everyone after 30 seconds.
global.mTimeForCacheFlush		= 15000;			//Time that the user stays in the cache after they leave.

global.mPMSpeak                 = true;            	//whether the bot will PM users so as to not spam
global.mModBop                  = true;            	//true, only mods can use the /dance command, false, anyone can.
global.mWaiter                 	= true;            	//whether bartender (if we add that function) is enabled by default
global.mLonelyDJ                = true;            	//whether the bot will dj if only one dj in room
global.mCheckAFKWithLonely		= false;			//Should we check to see if people are afk when they're using Lonely DJ?
global.mCheckSongCountWithLonely= false;			//Should we check the song count when they're using Lonely DJ?
global.mAfkBop                	= true;            	//whether bops reset the afk timer or not
global.mAutoBopForMods			= false;			//If we should automatically bop for mods and above.
global.mAutoBanBoots			= false;			//Instead of banning people, we simply boot them from the room.
global.mAutoBanOnTTLink			= true;				//Autobans someone from the room if they give a link to another room and joined < 1 minute ago
global.mAutoBanOnTTLinkTime		= 60000;			// If they post a link to a room on turntable within 60 seconds after joining the room, they will be banned. (60000=60 seconds.)
global.mDownVotesForOffGenre    = 3;
global.mHoldSpotForRefreshTime	= 2;				//The bot will hold a spot for 2 minutes per request if someone needs to refresh.

global.mDefaultGreeting         = "Ohai, @{usernames}, welcome to {room}!"; //the default greeting message "Hey, {username}, welcome to {room}!"
global.mVIPGreeting             = "Welcome @{usernames}, we have a VIP in the room!";
global.mSuperGreeting           = "Hold the music! There's a SU in the house! Welcome, @{usernames}!";
global.mModeratorGreeting       = "We've got a moderator in the room!  Welcome @{usernames}!";
global.mAddDJ                   = null;//"Welcome to the deck, @{username}!  Remember to follow the rules, and the current theme is {theme}.";
global.mRemDJ                   = null;
global.mAddMod                  = null;
global.mRemMod                  = null;
global.mEndSong                 = "{songtitle}: {up} ↑, {down} ↓.";
global.mOverMaxSongsQueueOn     = "Hey, @{username}, you're over your max songs!  You've got to wait {songwait} songs to get back up.";
global.mOverMaxSongsQueueOff    = null;
global.mHelpMsg                 = "Hey, {user.name}, the theme is {theme}, the song limit is {songlimit}, The queue is currently {queuecurrentlyon}, and {afk} minutes for afk.";  //the default help message.      
global.mWarnMsg                 = "Hey, {username}, no falling asleep on deck!";  //the default warning message   
global.mRemDJMsg                = "Sorry, {username}, you've been afk for too long.  I'm going to have to escort you off the stage.";
global.mAdvanceQueue            = "Hey @{username}, it's your time to shine!  Please take your spot before 5 minutes has passed.'";
global.mWarnDJNotNextInQueue    = "Sorry, {username}, you have to wait your turn.  It's currently {nextinqueue}'s turn to get on deck.";
global.mOpenSpotNoQueueing      = "Sorry, {username}, there's already an open spot.  Feel free to just hop up.";
global.mQueueOff                = "I'm sorry but the queue is currently off.";
global.mQueueStatus             = "There is currently {queueamount} people standing in line to get on deck.";
global.mQueueEmpty              = "The queue is currently empty!";
global.mQueueUsers              = "The queue is currently: {queueusers}, in that order.";
global.mQueueAdded              = "Alright, {username}, you've been added to the queue!";
global.mQueueAlreadyDJ          = "I'm sorry, {username}, but you're already a DJ."
global.mAlreadyInQueue          = "Sorry, {username}, but you're already in the queue."
global.mCommandsList            = "The list of commands are as follows: /{commands}";
global.mThemeIs                 = "The current theme is {theme}.";
global.mCurrentDJSongCount      = "The current song count is: {djsandsongcount}";
global.mCurrentDJAfkCount       = "The current afk timer is: {djsandafkcount}";
global.mRemoveFromQueue         = "You've been removed from the queue.";
global.mNotInQueue              = "You're not in the queue.";
global.mModRemoveFromQueue      = "Removed {username} from the queue.";
global.mInfoOnRoom				= "I see this is your first time to {roomname}, so I'll give you the run down.  The theme is {theme}, the song limit is {songlimit}, and if you're on deck you can only be afk for {afk} minutes.";
global.mNotDJ					= "I'm sorry {username}, but you're not a dj.";
global.mIsNowVIP				= "{username} is now a VIP.";
global.mIsNoLongerVIP			= "{username} is no longer a VIP."
global.mUnbanned				= "{username} is now unbanned.";
global.mBanReason				= "You're banned.  Gtfo.";
global.mBanned					= "{username} is now banned.";
global.mTheirUserId				= "{username}'s userid is: {user.userid}";
global.mYourUserId				= "Your userid is: {user.userid}";
global.mNotOnWhiteList			= "I'm sorry, but you're not on the whitelist."; /// PMed to User.
global.mAddedToWhiteList		= "{username} has been added to the whitelist.";
global.mRemovedFromWhiteList    = "{username} has been removed from the whitelist.";
global.mOffGenre				= "I'm sorry, but your song seems to be off genre, and we have to remove you from the deck."; // PMed to User.
global.mPMWillBootOffDeck		= "Alright, I'll boot you off the deck at the end of your song.";
global.mReadyRefresh			= "Okay, you can go ahead and refresh and I'll make sure you get your spot back.";

///global.mCanAdds                 = false;            //whether or not mods can add songs to bot's queue ///TODO: Why is this needed?

//Now, we begin the party.

require("./main.js");
