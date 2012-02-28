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
global.mOwners                  = [];               //hard coded array of userids for owners
global.mVIPs                    = [];               //hard coded array of VIP IDs

global.mMaxSongs                = 0;                //default song limit
global.mWaitSongs               = 1;                //how many songs you must wait after hitting limit to dj again
global.mLimitOn                 = true;             //if song limits are enabled by default
global.mQueueOn                 = true;             //if queue is enabled by default
global.mAFK                     = 20;               //default afk time (in minutes)
global.mWarn                     = false;               //Whether bot warns for AFKs
global.mMinSongLimitOperator    = null;              //Here ya go Dalton!  :D
global.mMinUsersForSongLimit    = null;               //TODO: This.
global.mMinDJsForSongLimit      = null;                //
global.mMinQueueOperator        = "&";              //
global.mMinUsersForQueue        = 30;               //
global.mMinDJsForQueue          = 3;                //
global.mSongLimitUserProportion = null;              //5 songs per 50 people in the room.
global.mNoSpamTimeout           = 15;               //30 seconds before the bot can say the same thing again.
global.mLoopTimeout             = 10;               //Does the main loop every 15 seconds.

global.mModBop                  = true;             //whether the /bop commands are for everyone or just mods
global.mWaiter                 = true;            //whether bartender (if we add that function) is enabled by default
global.mLonelyDJ                = true;             // whether the bot will dj if only one dj in room
global.mAfkBop                = true;             //whether bops reset the afk timer or not

global.mDefaultGreeting         = "Ohai, @{usernames}, welcome to {room}!"; //the default greeting message "Hey, {username}, welcome to {room}!"
global.mVIPGreeting             = "Welcome @{usernames}, we have a VIP in the room!";
global.mSuperGreeting           = "Hold the music! There's a SU in the house! Welcome, @{usernames}!";
global.mModeratorGreeting       = "We've got a moderator in the room!  Welcome @{usernames}!";
global.mAddDJ                   = null;//"Welcome to the deck, @{username}!  Remember to follow the rules, and the current theme is {theme}.";
global.mRemDJ                   = null;
global.mAddMod                  = null;
global.mRemMod                  = null;
global.mEndSong                  = "{songtitle}: [{up}] Awesomes, [{down}] Lames.";
global.mOverMaxSongsQueueOn     = "Hey, @{username}, you're over your max songs!  You've got to wait {songwait} songs to get back up.";
global.mOverMaxSongsQueueOff    = null;
global.mHelpMsg                 = "Hey, {username.name}, the theme is {theme}, the song limit is {songlimit}, The queue is currently {queuecurrentlyon}, and {afk} minutes for afk.";  //the default help message.      
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
///global.mCanAdds                 = false;            //whether or not mods can add songs to bot's queue ///TODO: Why is this needed?

//Now, we begin the party.

require("./main.js");
