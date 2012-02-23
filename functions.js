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
        Update_User(pData.user[0], true);
        // only greet if pData.user[0].RecentlyLeft - Date.now > joined delay. 
        Greet(pData.user[0]);
    }
};

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) Remove_User(pData.user[i]);   //not quite done yet. 
    // pData.user[i].RecentlyLeft = Date.now();
};

global.OnGotRoomInfo = function(pData){
    Log("Got Room Data");
    mRoomName = pData.room.name;
    //This is bad. don't update users on roominfo calls; idle wouldn't help it.
    for(var i = 0, len = pData.users.length; i < len; ++i) Update_User(pData.users[i], false); 
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
    if(mUsers[pData.userid]) Speak(mUsers[pData.userid], mRemMod, SpeakingLevel.MODChange);
    Log(data.name + " is no longer a moderator");
};

global.OnAddDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);  
    var sUser = pData.user[0];
    Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    if(mQueueCurrentlyEnabled) 
        if(!GuaranteeQueue(sUser)) return;      /// Guarantee that the next user in the queue is getting up.
    mSongCount[sUser.userid] = 0;
    Speak(sUser, mAddDJ, SpeakingLevel.DJChange);
    LonelyDj();
};

global.OnRemDJ = function(pData){
    mBot.roomInfo(OnGotRoomInfo);
    LonelyDj();
    var sUser = pData.user[0];
    Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    if(mJustRemovedDJ.indexOf(sUser.userid) != -1)
        mJustRemovedDJ.splice(mJustRemovedDJ.indexOf(sUser.userid), 1); /// Don't treat them like a normal DJ if we just forced them to step down.
    else
        Speak(sUser, mRemDJ, SpeakingLevel.DJChange);
    if(mQueueCurrentlyEnabled) QueueAdvance();        /// Advance the queue to the next person in line.
};

global.OnNewSong = function(pData){
    
    if(mSongLimitCurrentlyEnabled && mSongCount[mCurrentDJ.userid] >= mCurrentSongLimit) OverMaxSongs(mCurrentDJ);
    mCurrentDJ = mUsers[pData.room.current_dj]
    Increment_SongCount(mCurrentDJ);
    
    /*mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);
        Increment_SongCount(mCurrentDJ);
    });*/
}

global.OnSpeak = function(pData){
    var sUser = mUsers[pData.userid];
    if(sUser == null) return;
    Update_User(sUser, true);
    console.log(sUser.name+": "+pData.text);
};

global.OnPmmed = function(pData){
    console.log(JSON.stringify(pData));
};

global.Loop = function(){
    CheckAFKs();
};

function QueueAdvance(){
    if(!mNextUp)
        mNextUp = mCurrentQueue.pop();
    mParsing['{nextinqueue}'] = mUsers[mNextUp].name;
}
function GuaranteeQueue(pUser){
    if(!mNextUp) return true;
    if(mNextUp == pUser.userid){
        mNextUp = null;
        return true;
    }else{
        RemoveDJ(pUser);
        mBot.speak()
        return false;
    }
}

function Increment_SongCount(pUser){
  ++mSongCount[typeof(pUser) == 'number'?pUser:pUser.userid];
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

function OverMaxSongs(pUser){
    RemoveDJ(pUser);
    Speak(pUser, mOverMaxSongsQueueOn, SpeakingLevel.Misc);
}

function Greet(pUser){
    var sGreeting = mGreeting;
    if(Is_VIP(pUser)) sGreeting = mVIPGreeting;
    if(Is_SuperUser(pUser)) sGreeting = mSuperGreeting;
    var sOwnGreeting = mGreetings.filter(function(e){ return e.userid == pUser.userid; });
    if(sOwnGreeting && sOwnGreeting.length > 0) sGreeting = sOwnGreeting[0];
    Speak(pUser, sGreeting, SpeakingLevel.Greeting);
}

function Parse(pUser, pString){
    if(pUser) pString = pString.replace(/\{username\}/gi, pUser.name); /// We obviously need the pUser here.
    if(!mBooted) return pString;
    var sVariables = pString.match(/\{[^\}]\}/gi);
    for(var sVar in sVariables){
        if(mParsing[sVar])
            pString = pString.replace(sVar, mParsing[sVar]);
    }
    var sUsernameVariables = pString.match(/\{username\.[^}]*\}/gi);
    for(var sVar in sUsernameVariables){
        var sUserVar = sVar.split('.')[1];
        sUserVar = sUserVar.substring(0, sUserVar.length-1);
        if(pUser[sUserVar])
            pString = pString.replace(sVar, pUser[sUserVar]);
    }
    return pString;
}

function RefreshMetaData(pMetaData){
    if(pMetaData.current_song)
        mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i) mDJs[i] = pMetaData.djs[i];
    mCurrentDJ = mUsers[pMetaData.current_dj];
    mIsModerator = _.any(pMetaData.moderator_id, function(pId){ return pId == mUserId; });
    for(var i = 0, len = pMetaData.moderator_id.length; i < len; ++i) mModerators[pMetaData.moderator_id[i]] = true;
    
    IsSongQueueEnabled();
    IsSongLimitEnabled();
    CalculateSongLimit();
    
    LoadParsing();
}

function BootUp(){
    Log("Joined the room.  Booting up");
    SetMyName(mName);
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);
        setInterval(Loop,5000);
        mBooted = true;
        LonelyDj();
    });
}

function LoadParsing(){
    mParsing['{room}']                          = mRoomName;
    mParsing['{theme}']                         = mTheme;
    mParsing['{songlimit}']                     = mCurrentSongLimit;
    mParsing['{queue}']                         = mQueueOn ? "on" : "off";
    mParsing['{afklimit}']                      = mAFK;
    mParsing['{songwait}']                      = mWaitSongs;
    mParsing['{queuecurrentlyenabled}']         = mQueueCurrentlyEnabled ? "on" : "off";
    mParsing['{songlimitcurrentlyenabled}']     = mSongLimitCurrentlyEnabled ? "on" : "off";
    mParsing['{owners}']                        = mOwners.join(', ');
    mParsing['{vips}']                          = mVIPs.join(', ');
    mParsing['{dodrink}']                       = mDoDrink ? "on" : "off";
    mParsing['{modbop}']                        = mModBop ? "on" : "off";
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

function CheckAFKs(){
    if(!mAFK) return;
    for (i in mDJs) {
      var sUser = mUsers[mDJs[i]];
      if (CheckAFKTime(sUser)) BootAFK(sUser);
    }
}

function CheckAFKTime(pUser) {
    var sWarn = mAFK * (0.693148);
    var sLast = mAFKTimes[pUser.userid];
    var sAge = Date.now() - sLast;
    var sAge_Minutes = sAge / 60000; /// No Math.floor.  D:<
    if (sAge_Minutes >= mAFK) return true;
    if(!pUser.mAFKWarned && sAge_Minutes >= sWarn){
        Speak(pUser, mWarnMsg, SpeakingLevel.Misc);
        pUser.mAFKWarned = true;
    }
    return false;
}

function BootAFK(pUser){
    RemoveDJ(pUser);
    Speak(pUser, mRemDJMsg, SpeakingLevel.Misc);
}

function RemoveDJ(pUser){
    mJustRemovedDJ.push(pUser.userid);
    mBot.remDj(pUser.userid);
}

function LonlelyDj(){
    if(!mLonelyDJ) return;
    if(mDJs.length == 1 && (mDJs.indexOf(mUserId) == -1)) mBot.addDj();
    if((mDJs.length > 2 || mDJs.length == 1 ) && (mDJs.indexOf(mUserId) != -1)) mBot.remDj(); /// We could add ourselves to the justbooted, but it wouldn't matter since we can't talk about ourselves.
}
function Update_User(pUser, pSingle){
    if(pUser.userid in mUsers)
        Log(pUser.name + " updated");
    else
        Log(pUser.name + " joined the room" + (mRoomName === "" ? "" : " " + mRoomName));
    mUsers[pUser.userid] = pUser;
    if (pSingle) Update_AFKTime(pUser);
    /// Handle booting for bans here.
}

function Update_AFKTime(pUser){
    var sDate = new Date();
    mAFKTimes[pUser.userid] = sDate.getTime();
    pUser.mAFKWarned = false; /// We want to unward the user when they get updated, correct?
}

function IsSongQueueEnabled(){
    if(mMinQueueOperator == "&" && mMinUsersForQueue && mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinUsersForQueue <= mUsers.length && mMinDJsForQueue <= mDJs.length;
    else if(mMinQueueOperator && mMinUsersForQueue && mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && (mMinUsersForQueue <= mUsers.length || mMinDJsForQueue <= mDJs.length);
    else if(mMinUsersForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinUsersForQueue <= mUsers.length;
    else if(mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinDJsForQueue <= mDJs.length;
    else mQueueCurrentlyOn = mQueueOn;
}

function IsSongLimitEnabled(){
    if(mMinSongLimitOperator == "&" && mMinUsersForSongLimit && mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinUsersForSongLimit <= mUsers.length && mMinDJsForSongLimit <= mDJs.length;
    else if(mMinSongLimitOperator && mMinUsersForSongLimit && mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && (mMinUsersForSongLimit <= mUsers.length || mMinDJsForSongLimit <= mDJs.length);
    else if(mMinUsersForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinUsersForSongLimit <= mUsers.length;
    else if(mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinDJsForSongLimit <= mDJs.length;
    else mSongLimitCurrentlyOn = mLimitOn;
}

function CalculateSongLimit(){
    if(!mSongLimitUserProportion)
        mCurrentSongLimit = mMaxSongs;
    else
        mCurrentSongLimit = Math.floor(mSongLimitUserProportion / mUsers.length);
}

function Is_Moderator(pUser){return _.any(mModerators, function(pId){ return pUser.userid === pId; });}
function Is_SuperUser(pUser){return pUser.acl > 0;}
function Is_VIP(pUser){return mVIPs.indexOf(pUser.userid) != -1;}

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
