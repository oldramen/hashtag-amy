/*
    Copyright 2012 yayramen && Inumedia.
    This is the config file, where the variables for the bot are stored.
    You can have multiple config files, and run multiple bots with the 
    same source files.
*/
require("./enums.js");

//This is where setup the streamers and shit for the party.

//Variables
global.mAuthId          = "{auth_id}";      //authid of bot
global.mUserId          = "{user_id}";      //userid of bot
global.mRoomId          = "{room_id}";      //roomid of room to be hosted in
global.mMongoHost       = "{mongo_host}";   //host of mongodb
global.mMongoDatabase   = "{mongo_database}"; //mongocollection for bot.
global.mMongoUser       = "{mongo_user}";   //user of mongocollection
global.mMongoPass       = "{mongo_pass}";   //password to mongocollection
global.mMongoPort       = 27017;
global.mName            = "#Amy";            //name of bot
global.mOwner           = [];               //array of userids for owners
global.mVIPs            = [];               //array/object
global.mMaxSongs        = 3;                //default song limit
global.mOverMax         = 1;                //how many songs you can go over max before boot
global.mWaitSongs       = 10;               //how many songs you must wait after hitting limit to dj again
global.mTheme           = "Dubstep";        //default theme/genre for the room
global.mLimitOn         = false;            //if song limits are enabled by default
global.mQueueOn         = false;            //if queue is enabled by default
global.mAFK             = 10;               //default afk time (in minutes)
global.mModBop          = true;             //whether the /bop commands are for everyone or just mods
global.mDoDrink         = false;            //whether bartender (if we add that function) is enabled by default
global.mSpeakingLevel   = Speaking.Default; //whether or not the bot talks without being prompted (greetings, dj announcements, etc.)
global.mGreeting        = "Ohai, {username}, welcome to {room}!";                        //the default greeting message "Hey, {username}, welcome to {room}!"
global.mHelpMsg         = "Hey, {username}, {theme}, {songlimit}, {queue}, and {afk}.";  //the default help message. "Hey, {username}, {theme}, {songlimit}, {queue}, and {afk}."       
global.mCanAdds         = false;            //whether or not mods can add songs to bot's queue

//Now, we begin the party.

require("./main.js");