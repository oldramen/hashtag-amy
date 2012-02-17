//This is where the party starts.

//Variables
global.mAuthId        = "";                 //authid of bot
global.mUserId        = "";                 //userid of bot
global.mRoomId        = "";                 //roomid of room to be hosted in
global.mOwner         = [];                 //array of userids for owners
global.mVIPs          = [];                 //array/object
global.mMaxSongs      = 3;                  //default song limit
global.mOverMax       = 1;                  //how many songs you can go over max before boot
global.mWaitSongs     = 10;                 //how many songs you must wait after hitting limit to dj again
global.mTheme         = "Dubstep";          //default theme/genre for the room
global.mLimitOn       = false;              //if song limits are enabled by default
global.mQueueOn       = false;              //if queue is enabled by default
global.mAFK           = 10;                 //default afk time (in minutes)
global.mModBop        = true;               //whether the /bop commands are for everyone or just mods
global.mDoDrink       = false;              //whether bartender (if we add that function) is enabled by default
global.mSpeakingLevel = Speaking.Default;   //whether or not the bot talks without being prompted (greetings, dj announcements, etc.)
global.mGreeting      = "Ohai, {username}, welcome to {room}!";                         //the default greeting message "Hey, {username}, welcome to {room}!"
global.mHelpMsg       = "Hey, {username}, {theme}, {songlimit}, {queue}, and {afk}.";  //the default help message. "Hey, {username}, {theme}, {songlimit}, {queue}, and {afk}."       
global.mCanAdds       = false;              //whether or not mods can add songs to bot's queue