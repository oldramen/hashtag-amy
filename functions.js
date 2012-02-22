/*
    Copyright 2012 yayramen && Inumedia.
    This is the functions file, where the magic happens.
    This file contains all the information and functions
    that make the bot actually work. The heart of the entire operation.
*/
global.Log = function(pOutput){
    console.log(mName,">>>", pOutput + ".");
};

global.OnRegistered = function(pData){
    if(pData.user.length == 0) return;
    if(IsMe(pData.user[0])) BootUp();
    if(!IsMe(pData.user[0])){
        Update_User(pData.user[0]);
        Greet(pData.user[0]);
    }
};

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) Remove_User(pData.user[i]);
};

global.OnGotRoomInfo = function(pData){
    Log("Got Room Data");
    mRoomName = pData.room.name;
    for(var i = 0, len = pData.users.length; i < len; ++i) Update_User(pData.users[i]);
    RefreshMetaData(pData.room.metadata);
};

global.OnNewModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = true;
    else mModerators[pData.userid] = true;
    if(mUsers[pData.userid]) Speak(mUsers[pData.userid], mAddMod, SpeakingLevel.MODChange);
    Log(data.name + " is now a moderator");
};

global.OnRemModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = false;
    else delete mModerators[pData.userid];
    if(mUsers[pData.userid]) (mUsers[pData.userid], mRemMod, SpeakingLevel.MODChange);
    Log(data.name + " is no longer a moderator");
};

global.OnAddDJ = function(pData){
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);           /// Refresh room data.
    });  
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    Speak(pData.user[0], mAddDJ, SpeakingLevel.DJChange);
    if(mQueueOn) GuaranteeQueue();      /// Guarantee that the net user in the queue is getting up.
};

global.OnRemDJ = function(pData){
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);           /// Refresh current DJs
    });
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    Speak(pData.user[0], mRemDJ, SpeakingLevel.DJChange);
    if(mQueueOn) QueueAdvance();        /// Advance the queue to the next person in line.
};

global.OnSpeak = function(pData){
    var sUser = mUsers[pData.userid];
    if(sUser == null) return;
    Update_User(sUser);
    console.log(sUser.name+": "+pData.text);    
};

function BotMaintain(){
    CheckAFKs();
}

function CheckAFKs(){
    for (i in mDJs) {
      var sUser = mUsers[mDJs[i]];
      if (CheckAFKTime(sUser)) mBot.remDj(sUser);
    }
}

 function CheckAFKTime(pUser) {
    var sWarn = mAFK * (0.693148);
    var sLast = mAFKTimes[pUser.userid];
    var sAge = Date.now() - sLast;
    var sAge_Minutes = Math.floor(sAge / 60000);
    if (sAge_Minutes >= mAFK) return true;
    if(!mUser[mDJs[i]].mAFKWarned && sAge_Minutes >= sWarn)
        Speak(pUser, mWarnMsg, SpeakingLevel.Misc);
    return false;
};

function QueueAdvance(){
    
}

function GuaranteeQueue(){
    
}

function Speak(pUser, pSpeak, pSpeakingLevel){
    if(!pSpeak) return;
    if(IsMe(pUser)) return;
    pSpeak = Parse(pUser, pSpeak);
    if(SpeakingAllowed(pSpeakingLevel)) 
        mBot.speak(pSpeak);
    return pSpeak;
}

function SpeakingAllowed(pSpeakingLevel){
    if(mSpeakingLevel.flags.indexOf(SpeakingLevel.Verbose) != -1) return true;
    else return mSpeakingLevel.indexOf(pSpeakingLevel) != -1;
}

function Greet(pUser){
    var sGreeting = mGreeting;
    ///if(Is_VIP(pUser)) sGreeting = mVIPGreeting;
    if(Is_SuperUser(pUser)) sGreeting = mSuperGreeting;
    var sOwnGreeting = mGreetings.filter(function(e){ return e.userid == pUser.userid; });
    if(sOwnGreeting && sOwnGreeting.length > 0) sGreeting = sOwnGreeting[0];
    Speak(pUser, sGreeting, SpeakingLevel.Greeting);
}

function Parse(pUser, pString){
    if(pUser) pString = pString
    .replace(/\{username\}/gi, pUser.name)
    .replace(/\{room\}/gi, mRoomName)
    .replace(/\{theme\}/gi, mTheme);
    return pString;
}

function RefreshMetaData(pMetaData){
    if(pMetaData.current_song)
        mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i) mDJs[i] = pMetaData.djs[i];
    Log("Currently: "+len+" djs");
    if(len == 1 && (mDJs.indexOf(mUserId) == -1)) mBot.addDj();
    if((len > 2 || len == 1 ) && (mDJs.indexOf(mUserId) != -1)) mBot.remDj();
    mCurrentDJ = pMetaData.current_dj;
    mIsModerator = _.any(pMetaData.moderator_id, function(pId){ return pId == mUserId; });
    for(var i = 0, len = pMetaData.moderator_id.length; i < len; ++i) mModerators[pMetaData.moderator_id[i]] = true;
}

function BootUp(){
    Log("Joined the room.  Booting up");
    SetMyName(mName);
    mBot.roomInfo(OnGotRoomInfo);
}

function IsMe(pUser){
    return pUser.userid == mUserId;
}

function SetMyName(pName){
    mBot.modifyProfile({ name: pName });
    mBot.modifyName(pName);
}

function Remove_User(pUser){
    delete mUsers[pUser.userid];
    delete mAFKTimes[pUser.userid];
}

function Update_User(pUser){
    if(pUser.userid in mUsers)
        Log(pUser.name + " updated");
    else
        Log(pUser.name + " joined the room" + (mRoomName === "" ? "" : " " + mRoomName));
    mUsers[pUser.userid] = pUser;
    Update_AFKTime(pUser);
    /// Handle booting for bans here.
}

function Update_AFKTime(pUser){
    var sDate = new Date();
    mAFKTimes[pUser.userid] = sDate.getTime();
    pUser.mAFKWarned = false;
}

function Is_Moderator(pUser){
    return _.any(mModerators, function(pId){ return pUser.userid === pId; });
}

function Is_SuperUser(pUser){
    return pUser.acl > 0;
}

global.InitMongoDB = function(){
    var sConnectionString = mMongoUser+':'+mMongoPass+"@"+mMongoHost+":"+mMongoPort+"/"+mMongoDatabase+"?auto_reconnect";
    Log("Connecting to: " + sConnectionString);
    mMongoDB = mMongo.db(sConnectionString);
};

global.Refresh = function(pFrom, pCallback){
    Log("Refreshing: "+ pFrom);
    var sCollection = mMongoDB.collection(pFrom);
	if(!sCollection) return false;
    sCollection.find().toArray(pCallback);
    return true;
};

global.Insert = function(pTo, pData){
    mMongoDB.collection(pTo).insert(pData);
};

global.Remove = function(pFrom, pData){
    mMongoDB.collection(pFrom).remove(pData);
};
