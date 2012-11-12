/*
    Copyright 2012 yayramen && Inumedia.
    This is the enums file, where the speaking variables are stored.
    Change the value in the config files, controls how much the bot 
    spits out.

    Common Variables: 
    {usernames} - to spit out user's name in greeting
    {username} - to spit out user's name everywhere else
    {room} - to spit out room's name
*/

//Response Values

//Greetings
//global.mDefaultGreeting         = "/me pats down @{usernames}, you packin' son? You wit da {room} now!"; 
global.mDefaultGreeting			= [	"/me pats down @{usernames}, you packin' son? You wit da {room} now!", 
								"/me hugs @{usernames} mmm.. you smell good. Welcome to {room}!",
								"/me hugs @{usernames}. Welcome to {room}!",
								"Hello @{usernames}. How are you? Welcome to {room}!",
								"@{usernames} is here at {room} now. Shhh, stop talking 'bout them!",
								"Welcome to {room} @{usernames}! Hey, could you please scratch my back... oh yeah that's the spot!",
								"I LOVE the way you HURT me @{usernames}! Welcome to {room}."]
global.mVIPGreeting             = "Welcome @{usernames}, we have a VIP in the room!";
global.mSuperGreeting           = "Hold the music! There's a SU in the house! Welcome, @{usernames}!";
global.mModeratorGreeting       = ":guardsman: Moderator @{usernames} has arrived :guardsman:";
global.mInfoOnRoom              = "Hi {username}! Welcome to {roomname}! The theme is {theme}, the song limit is {songlimit}, and if you're on deck you can only be afk for {afk} minutes.";
//The mInfoOnRoom variable is the PM sent to first time visitors

//Events
global.mAddDJ                   = null;
global.mRemDJ                   = null;
global.mAddMod                  = null;
global.mRemMod                  = null;
global.mSnagMSg                 = null;
//global.mEndSong                 = "{songtitle}: {up} :point_up_2:, {down} :point_down:, {heartcount} :blue_heart:.";
//global.mEndSong                 = "{songtitle}: ( {up} :+1:  {down} :-1:  {heartcount} :blue_heart: )";
global.mEndSong                 = "{songtitle}: ( {up} :+1:  {heartcount} :blue_heart: )";

//Song Limit
global.mOverMaxSongsQueueOn     = "Hey, @{username}, you're over your max songs!  You've got to wait {songwait} song(s) to get back up.";
global.mOverMaxSongsQueueOff    = null;
global.mOverMaxSongsWarn        = "Hey, @{username}, you've played your limit. Let someone else have a go.";
global.mHaveToWait              = "I'm sorry but you have to wait {user.mWaitingSongLimit} song(s) to get back up.";

//Lotto
global.mNoLotto                 = "Sorry, Lotto is currently disabled.";
global.mNoLottoWithQueue        = "I can't turn Lotto on if the queue is on!";
global.mNotLottoTime            = "Sorry, you can't spin yet.";
global.mTimeToLotto             = "Okay, it's time to type /spin if you want to DJ! You got {spintimeleft} seconds to spin!";
global.mCantLottoTwice          = "Sorry, {username}, you've already spun!";
global.mLottoThanks             = "Thanks for spinning, {username}!";
global.mLottoWinner             = "@{username} won the spin! Hop on deck, you got {holdtimeleft} seconds to claim your spot!";
global.mNobodySpin              = "Nobody spun for the DJ spot! This one's FFA!";
global.mNoQueueWithLotto        = "I can't turn the queue on if lotto is on!";

//AFK
global.mWarnMsg                 = "Hey, @{username}, no falling asleep on deck!";  //the default warning message   
global.mRemDJMsg                = "/tableflip {username}, you've been afk for too long.";

//Queue
global.mAdvanceQueue            = "Hey @{username}, it's your time to shine!  Please take your spot before {queuetimeout} seconds has passed.'";
global.mWarnDJNotNextInQueue    = "Sorry, {username}, you have to wait your turn.  It's currently {nextinqueue}'s turn to get on deck.";
global.mOpenSpotNoQueueing      = "Sorry, {username}, there's already an open spot.  Feel free to just hop up.";
global.mQueueOff                = "I'm sorry but the queue is currently off.";
global.mQueueStatus             = "There is currently {queueamount} people standing in line to get on deck.";
global.mQueueEmpty              = "The queue is currently empty!";
global.mQueueUsers              = "The queue is currently: {queueusers}, in that order.";
global.mQueueAdded              = "Alright, {username}, you've been added to the queue!";
global.mQueueAlreadyDJ          = "I'm sorry, {username}, but you're already a DJ."
global.mAlreadyInQueue          = "Sorry, {username}, but you're already in the queue."
global.mRemoveFromQueue         = "You've been removed from the queue.";
global.mNotInQueue              = "You're not in the queue.";
global.mModRemoveFromQueue      = "Removed {username} from the queue.";
global.mClearQueue              = "Queue Cleared";

//VIP
global.mIsNowVIP                = "{username} is now a VIP.";
global.mIsNoLongerVIP           = "{username} is no longer a VIP."
global.mVIPList                 = "VIPs: {vip_list}";

//Bans
global.mUnbanned                = "{username} is now unbanned.";
global.mBanReason               = "You're banned.  Gtfo.";
global.mBanned                  = "{username} is now banned.";
global.mBANList                 = "BANNED USERs: {ban_list}";

//Whitelist
global.mNotOnWhiteList          = "I'm sorry, but you're not on the whitelist."; /// PMed to User.
global.mAddedToWhiteList        = "{username} has been added to the whitelist.";
global.mRemovedFromWhiteList    = "{username} has been removed from the whitelist.";
global.mWhiteListed             = "Whitelisted: {whitelisted}";

//Song
global.mLonelyStillOn           = "Sorry, I can't DJ with LonelyDJ enabled D:";
global.mBotDJTurnedOff          = "Sorry, I don't know how to DJ";
global.mSongSkip                = "Skipped '{skippedsong}'. Next Song: '{nextsong}' Type /song requeue to undo.";
global.mSongRequeue             = "Moved {bottomsong} to the top of the queue.";
global.mSongSuffle              = "Shuffled Queue.";
global.mSongAdd                 = "Added {currentsong} to queue!";
global.mSongRemove              = "Removing {lastsong}";
global.mSongRemoveNotDJ         = "You can only remove a song when I'm playing a song.";
global.mSongNext                = "Next song: {next} by {artist}";
global.mSongTotal               = "Total Songs In My Queue: {songtotal}";
global.mSongSearchEmpty         = "No results found for {query}";
global.mSongSearchLong          = "Returned {numsongs} results, displaying first 5.";

//Twitter
global.mDefaultTweet            = "{currentdj} is playing {song} right now!";
global.mConfirmTweet            = "Tweet sent!";
global.mTweetLimit              = "Your tweet is {charlimit} characters over the limit!";
global.mTweetSpam               = "Don't spam! You can only tweet once every {twitime} minutes! Wait for a bit :P";

//Last.fm
global.mNoLastfm                = "You need to enable lastfm to use this feature!";
global.mNoInfoLastfm            = "This stuff is too underground for me to find any information!";
global.mLastfmNoArgs            = "Sorry, what am I looking up? Genre or Artist?";
global.mLastfmGenre             = "This song is {lastfmgenre}.";

//General
global.mHelpMsg                 = "Hey, {username}, the theme is {theme}, there is no song limit. No queue, FFA (Free For All), and {afk} minutes for afk.";  //the default help message.      
global.mCommandsList            = "The list of commands are as follows: /{commands}";
global.mThemeIs                 = "Theme: {theme}.";
global.mCurrentDJSongCount      = "The current song count is: {djsandsongcount}";
global.mCurrentDJAfkCount       = "Minutes since last chat: {djsandafkcount}";
global.mNotDJ                   = "I'm sorry {username}, but you're not a dj.";
global.mTheirUserId             = "{username}'s userid is: {user.userid}";
global.mYourUserId              = "Your userid is: {user.userid}";
global.mOffGenre                = "I'm sorry, but your song seems to be off genre, and we have to remove you from the deck."; // PMed to User.
global.mPMWillBootOffDeck       = "Alright, I'll boot you off the deck at the end of your song.";
global.mReadyRefresh            = "Okay, you can go ahead and refresh and I'll make sure you get your spot back.";
global.mSpotOpenFor             = null;
global.mNotMod                  = "I'm not a mod, but I can annoy the hell out of you!";
global.mAlbum                   = "{title} is on {album}";
global.mGreetChange             = "{username}'s greeting set to: {greeting}";
global.mUserInfo                = "{username}'s hearts: {heart_count}, hearts given: {given_count}, total songs: {total_songs}, Heart Percentage: {heart_percentage}%";

global.mBandFirstNames          = ["RANCID", "INSANE", "BLACK", "IRON", "HOLY", "RABID", "BLOODY", "SATAN'S", "BASTARD", "FORESAKEN", "HELL'S", "FORBIDDEN", "DARK", "FRANTIC", "DEVIL'S", "EVIL", "INNER", "BLEEDING", "GUILTY", "WITCH'S", "HEAVY", "ILLEGAL", "FALLEN", "SINISTER", "CRAZY", "TROUBLED"] 
global.mBandLastNames           = ["EMPIRE", "FURY", "RAGE", "ZOMBIES", "SIN", "WARRIORS", "ANGELS", "DEATH", "ANARCHY", "HENCHMEN", "KILL", "VENGANCE", "TENDENCIES", "MAGIC", "SOLDIER", "GODS", "GOBLIN", "SPAWN", "TEMPLE", "REALM", "HATE", "SLAVES", "THORN", "ABYSS", "FIRE", "SECRETS"]

//most of these are from TT Squared
global.mIdleMessages            = [
"ugh I've got so much work to do",
"busy day over here",
"wish i wasn't so busy",
"liking this",
"good track",
"nice mix",
"wish i didn't have to send messages to prevent idle...",
"love tt.fm",
"back to work..",
"im so tired",
"can't wait till 5",
"i should be working",
"moar coffee",
"check check",
"still here",
"checking in",
"right here",
"not idle",
"i'm here",
"whatup",
"mos def",
"not here",
"sup",
"definitely not here",
"yes.. right here",
"yepp",
", right here",
", still here",
"wink wink"
]

//Speaking Values [advanced use only]
global.SpeakingLevel = {
    Misc: {val: 1, status: "Misc"},
    Greeting:{val: 2, status: "Greeting"},
    SongChange:{val: 3, status: "SongChange"},
    DJChange:{val: 4, status: "DJChange"},
    MODChange:{val: 5, status: "MODChange"},
    Errors: {val: 6, status: "Errors"},
    Debug: { val: 7, status: "Debug"},
    Verbose: {val: 8, status: "Verbose"}
}

global.Speaking = {
    Default: { flags: [SpeakingLevel.Greeting, SpeakingLevel.Misc] },
    Shy: { flags: [SpeakingLevel.Misc] },
    Silent: { flags: [] },
    Debug: { flags: [SpeakingLevel.Verbose] }
};

global.Requires = {
    User:       { val: 0, status: "User", check: function(pUser){ return true; } },
    VIP:        { val: 1, status: "VIP", check: function(pUser){ return pUser.GetLevel() > 1; }},
    Moderator:  { val: 2, status: "Moderator", check: function(pUser){ return pUser.GetLevel() > 2; } },
    SuperUser:  { val: 3, status: "SuperUser", check: function(pUser){ return pUser.GetLevel() > 3; } },
    Owner:      { val: 4, status: "Owner", check: function(pUser){ return pUser.isOwner; } }
}
