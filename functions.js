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
    for(var i = 0, len = pData.user.length; i < len; ++i)
        if(!IsMe(pData.user[i])){
            Update_User(pData.user[i], true);
            mPushingOutGreeting.push(pData.user[i]);
        }
    CalculateProperties();
};

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) Remove_User(pData.user[i]);   //not quite done yet. 
    // pData.user[i].RecentlyLeft = Date.now();
    CalculateProperties();
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
    var sUser = mUsers[pData.userid];
    if(IsMe(pData.userid)) mIsModerator = true;
    else mModerators[pData.userid] = true;
    if(sUser) Speak(mUsers[sUser], mAddMod, SpeakingLevel.MODChange);
    Log(sUser.name + " is now a moderator");
};

global.OnRemModerator = function(pData){
    if(!pData.success) return;
    var sUser = mUsers[pData.userid];
    if(IsMe(pData.userid)) mIsModerator = false;
    else delete mModerators[pData.userid];
    if(sUser) Speak(sUser, mRemMod, SpeakingLevel.MODChange);
    Log(sUser.name + " is no longer a moderator");
};

global.OnAddDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);
    var sUser = pData.user[0];
    Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    mDJs.push(sUser.userid);
    if(mQueueCurrentlyOn) 
        if(!GuaranteeQueue(sUser)) return;      /// Guarantee that the next user in the queue is getting up.
    mSongCount[sUser.userid] = 0;
    LonelyDJ();
    Speak(sUser, mAddDJ, SpeakingLevel.DJChange);
};

global.OnRemDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);
    var sUser = pData.user[0];
    Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    mDJs.splice(mDJs.indexOf(sUser.userid),1);
    delete mSongCount[sUser.userid];
    LonelyDJ();
    if(mJustRemovedDJ.indexOf(sUser.userid) != -1)
        mJustRemovedDJ.splice(mJustRemovedDJ.indexOf(sUser.userid),1); /// Don't treat them like a normal DJ if we just forced them to step down.
    else
        Speak(sUser, mRemDJ, SpeakingLevel.DJChange);
    if(mQueueCurrentlyOn) QueueAdvance();        /// Advance the queue to the next person in line.
};

global.OnNewSong = function(pData){
    if(mSongLimitCurrentlyOn && mSongCount[mCurrentDJ.userid] >= mCurrentSongLimit) OverMaxSongs(mCurrentDJ);
    mCurrentDJ = mUsers[pData.room.metadata.current_dj];
    if(mCurrentDJ) Increment_SongCount(mCurrentDJ);
};

global.OnSpeak = function(pData){
    var sUser = mUsers[pData.userid];
    var sText = pData.text;
    if(sUser == null) return;
    Update_User(sUser, true);
    console.log(sUser.name+": "+sText);
    if(sText.match(/^[!*\/]/) || mBareCommands.indexOf(sText) !== -1) HandleCommand(sUser, sText);
};

global.OnPmmed = function(pData){
    console.log(JSON.stringify(pData));
};

global.OnSnagged = function(pData){
    //Do Hearts here.
}

global.Loop = function(){
    CheckAFKs();
    CalculateProperties();
    Greet(mPushingOutGreeting);
    mPushingOutGreeting = [];
    RemoveOldMessages();
};

global.RemoveOldMessages = function(){
    var timestamp = (new Date()).getTime() - mNoSpamTimeout * 1000;
    var sOldMessages = mSpokenMessages.filter(function(e){ return e.timestamp < timestamp });
    for(var i = 0; i < sOldMessages.length; ++i)
        mSpokenMessages.splice(mSpokenMessages.indexOf(sOldMessages[i]),1);
}
global.QueueAdvance = function(){
    if(!mQueueNextUp)
        mQueueNextUp = mQueue.shift();
    if(mQueueNextUp){
        mParsing['{nextinqueue}'] = mUsers[mQueueNextUp].name;
        if(!mQueueNotified)
            Speak(mUsers[mQueueNextUp], mAdvanceQueue, SpeakingLevel.Misc);
        mQueueNotified = true;
    }
    ParsingForQueue();
};
global.GuaranteeQueue = function(pUser){
    if(!mQueueNextUp) return true;
    if(mQueueNextUp == pUser.userid){
        mQueueWarned = [];
        mQueueNotified = false;
        mQueueNextUp = null;
        return true;
    }else{
        RemoveDJ(pUser);
        if(mQueueWarned.indexOf(pUser.userid) == -1){
            Speak(pUser, mWarnDJNotNextInQueue, SpeakingLevel.Misc);
            mQueueWarned.push(pUser);
        }
        return false;
    }
};

global.QueuePush = function(pUser){
    mQueue.push(pUser);
    Log(mQueue.length);
    ParsingForQueue();
};

global.ParsingForQueue = function(){
    mParsing['{queueamount}'] = mQueue.length;
    if (mQueue.length < 1) mParsing['{queueusers}'] = null;
    if (mQueue.length > 0) {
        var sQueueUsers = [];
            for(var sQ in mQueue){
                var sUser = mQueue[sQ];
                var sName = mUsers[sUser].name;
                sQueueUsers.push(sName);
              }
            mParsing['{queueusers}'] = sQueueUsers.join(', ');
   }
};

global.Increment_SongCount = function(pUser){
  ++mSongCount[typeof(pUser) == 'number'?pUser:pUser.userid];
  Log(pUser.name + "'s song count: " + mSongCount[pUser.userid]);
};

global.Speak = function(pUser, pSpeak, pSpeakingLevel, pArgs){
    if(!pSpeak) return;
    if(IsMe(pUser)) return;
    pSpeak = Parse(pUser, pSpeak, pArgs);
    if(!mSpokenMessages.filter(function(e){ return e.message == pSpeak }).length){
        if(SpeakingAllowed(pSpeakingLevel)) 
            mBot.speak(pSpeak);
        mSpokenMessages.push({message: pSpeak, timestamp: (new Date()).getTime()});
    }
    return pSpeak;
};

global.SpeakingAllowed = function(pSpeakingLevel){
    if(mSpeakingLevel.flags.indexOf(SpeakingLevel.Verbose) != -1) return true;
    else return mSpeakingLevel.indexOf(pSpeakingLevel) != -1;
};

global.OverMaxSongs = function(pUser){
    RemoveDJ(pUser);
    Speak(pUser, mOverMaxSongsQueueOn, SpeakingLevel.Misc);
};

global.Greet = function(pUsers){
    var sDefaultGreetings = [];
    var sVIPGreetings = [];
    var sSuperUserGreetings = [];
    var sModeratorGreetings = [];
    for(var i = 0; i < pUsers.length; ++i){
        var pUser = pUsers[i];
        var sOwnGreeting = mGreetings.filter(function(e){ return e.userid == pUser.userid; });
        if(sOwnGreeting && sOwnGreeting.length > 0){ 
            sGreeting = sOwnGreeting[0];
            Speak(pUser, sGreeting, SpeakingLevel.Greeting);
        }else if(Is_SuperUser(pUser)) sSuperUserGreetings.push(pUser);
        else if(Is_Moderator(pUser)) sModeratorGreetings.push(pUser);
        else if(Is_VIP(pUser)) sVIPGreetings.push(pUser);
        else sDefaultGreetings.push(pUser);
    }
    if(sSuperUserGreetings.length > 0) Speak(sSuperUserGreetings, mSuperGreeting, SpeakingLevel.Greeting);
    if(sModeratorGreetings.length > 0) Speak(sModeratorGreetings, mModeratorGreeting, SpeakingLevel.Greeting);
    if(sVIPGreetings.length > 0) Speak(sVIPGreetings, mVIPGreeting, SpeakingLevel.Greeting);
    if(sDefaultGreetings.length > 0) Speak(sDefaultGreetings, mDefaultGreeting, SpeakingLevel.Greeting);
};

global.Parse = function(pUser, pString, pArgs){
    if(pUser && !pUser.length) pString = pString.replace(/\{username\}/gi, pUser.name); /// We obviously need the pUser here.
    if(pUser && pUser.length && pUser.length > 0) {
        var sUsers = pUser[0].name;
        var sJoin = ", ";
        if(pString.match(/@\{usernames}/gi)) sJoin = ", @";
        if(pUser.length > 1) sUsers = _.reduce(pUser, function(pUsers, pUserNew){ 
                return (typeof(pUsers) == 'string' ? pUsers : pUsers.name) + sJoin + pUserNew.name;
        });
        pString = pString.replace(/\{usernames\}/gi, sUsers);
    }
    if(!mBooted) return pString; /// If we haven't booten up, don't bother even trying to use the variables.
    var sVariables = pString.match(/\{[^\}]*\}/gi);
    if(sVariables == null) return pString;
    for(var i = 0; i < sVariables.length; ++i){
        var sVar = sVariables[i];
        if(mParsing[sVar] != null)
            pString = pString.replace(sVar, mParsing[sVar]);
    }
    var sUsernameVariables = pString.match(/\{username\.[^}]*\}/gi);
    if(sUsernameVariables)
        for(var i = 0; i < sUsernameVariables.length; ++i){
            var sVar = sUsernameVariables[i];
            var sUserVar = sVar.split('.')[1];
            sUserVar = sUserVar.substring(0, sUserVar.length-1);
            if(pUser[sUserVar] != null)
                pString = pString.replace(sVar, pUser[sUserVar]);
        }
    if(pArgs && pArgs.length){
        Log("Got args.");
        for(var i = 0; i < pArgs.length; ++i)
        {
            var sArg = pArgs[i];
            var sParameter = null;
            var sValue = null;
            if(sArg.length && sArg.length == 2){
                Log("Got array args.")
                sParameter = sArg[0];
                sValue = sArg[1];
            }else if(sArg.parameter && sArg.value){
                Log("Got object args.");
                sParameter = sArg.parameter;
                sValue = sArg.value;
            }
            if(sParameter != null && sValue != null) pString = pString.replace(sParameter, sValue);
        }
    }
    return pString;
};

global.RefreshMetaData = function(pMetaData){
    if(pMetaData.current_song)
        mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i){
        mDJs[i] = pMetaData.djs[i];
        mSongCount[pMetaData.djs[i]] = 0;
    }
    mCurrentDJ = mUsers[pMetaData.current_dj];
    mIsModerator = pMetaData.moderator_id.indexOf(mUserId) != -1;
    mModerators = pMetaData.moderator_id;
    mMaxDJs = pMetaData.max_djs;
    
    CalculateProperties();
    
    LoadParsing();
};

global.BootUp = function(){
    Log("Joined the room.  Booting up");
    SetMyName(mName);
    SetLaptop();
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);
        setInterval(Loop, mLoopTimeout);
        mBooted = true;
        Log("Booted up.  We're set to go");
        LonelyDJ();
    });
};

global.LoadParsing = function(){
    mParsing['{room}']                          = mRoomName;
    mParsing['{theme}']                         = mTheme;
    mParsing['{songlimit}']                     = mCurrentSongLimit;
    mParsing['{queue}']                         = mQueueOn ? "on" : "off";
    mParsing['{afklimit}'] = mParsing['{afk}']  = mAFK;
    mParsing['{songwait}']                      = mWaitSongs;
    mParsing['{queuecurrentlyon}']              = mQueueCurrentlyOn ? "on" : "off";
    mParsing['{songlimitcurrentlyon}']          = mSongLimitCurrentlyOn ? "on" : "off";
    mParsing['{owners}']                        = mOwners.join(', ');
    mParsing['{vips}']                          = mVIPs.join(', ');
    mParsing['{waiter}']                       = mWaiter ? "on" : "off";
    mParsing['{modbop}']                        = mModBop ? "on" : "off";
    mParsing['{queueamount}']                   = 0;
    Log("Updated Parsing Library");
};

global.IsMe = function(pUser){
    if(!pUser) return false;
    return pUser.userid == mUserId;
};

global.SetMyName = function(pName){
    mBot.modifyProfile({ name: pName });
    mBot.modifyName(pName);
};
global.SetLaptop = function(){
    mBot.modifyLaptop(mLaptop);
};

global.Remove_User = function(pUser){
    delete mUsers[pUser.userid];
    delete mAFKTimes[pUser.userid];
    --mUsers.length;
    if(mQueue.indexOf(pUser.userid) != -1){
        mQueue.splice(mQueue.indexOf(pUser.userid),1);
        ParsingForQueue();
    }
    mPushingOutGreeting.splice(mPushingOutGreeting.indexOf(pUser.userid),1);
};

global.CheckAFKs = function(){
    if(!mAFK) return;
    for (i in mDJs) {
      var sUser = mUsers[mDJs[i]];
      if (CheckAFKTime(sUser)) BootAFK(sUser);
    }
};

global.CheckAFKTime = function(pUser) {
    var sWarn = mAFK * (0.693148);
    var sLast = mAFKTimes[pUser.userid];
    var sAge = Date.now() - sLast;
    var sAge_Minutes = sAge / 60000; /// No Math.floor.  D:<
    if (sAge_Minutes >= mAFK) return true;
    if(!pUser.mAFKWarned && sAge_Minutes >= sWarn && (mWarn)){
        Speak(pUser, mWarnMsg, SpeakingLevel.Misc);
        pUser.mAFKWarned = true;
    }
    return false;
};

global.BootAFK = function(pUser){
    RemoveDJ(pUser);
    Speak(pUser, mRemDJMsg, SpeakingLevel.Misc);
};

global.RemoveDJ = function(pUser){
    if(!mIsModerator) return;
    mJustRemovedDJ.push(pUser.userid);
    mBot.remDj(pUser.userid);
};

global.LonelyDJ = function(){
    if(!mLonelyDJ){ return; }
    if(mDJs.length == 1 && (mDJs.indexOf(mUserId) == -1))
        mBot.addDj();
    if((mDJs.length > 2 || mDJs.length == 1 ) && (mDJs.indexOf(mUserId) != -1))
         mBot.remDj(); /// We could add ourselves to the justbooted, but it wouldn't matter since we can't talk about ourselves.
};
global.Update_User = function(pUser, pSingle){
    if(pUser.userid in mUsers){
        //Log(pUser.name + " updated");
    }else{
        HandleBan(pUser);
        //Log(pUser.name + " joined the room" + (mRoomName === "" ? "" : " " + mRoomName));
        ++mUsers.length;
    }
    mUsers[pUser.userid] = pUser;
    if (pSingle) Update_AFKTime(pUser);
};

global.HandleBan = function(pUser){
    if(_.find(mBans, function(pItem){ return pItem.userid == pUser.userid; })){
        Log(pUser.name + " is banned.  Booting");
        mBot.bootUser(pUser.userid, "You're banned.  Gtfo.");
    }
};

global.Update_AFKTime = function(pUser){
    var sDate = new Date();
    mAFKTimes[pUser.userid] = sDate.getTime();
    pUser.mAFKWarned = false; /// We want to unward the user when they get updated, correct?
};

global.CalculateProperties = function(){
    IsSongQueueEnabled();
    IsSongLimitEnabled();
    CalculateSongLimit();
};

global.IsSongQueueEnabled = function(){
    if(mMinQueueOperator == "&" && mMinUsersForQueue && mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinUsersForQueue <= mUsers.length && mMinDJsForQueue <= mDJs.length;
    else if(mMinQueueOperator && mMinUsersForQueue && mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && (mMinUsersForQueue <= mUsers.length || mMinDJsForQueue <= mDJs.length);
    else if(mMinUsersForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinUsersForQueue <= mUsers.length;
    else if(mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinDJsForQueue <= mDJs.length;
    else mQueueCurrentlyOn = mQueueOn;
    mParsing['{queuecurrentlyon}'] = mQueueCurrentlyOn ? "on" : "off";
};

global.IsSongLimitEnabled = function(){
    if(mMinSongLimitOperator == "&" && mMinUsersForSongLimit && mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinUsersForSongLimit <= mUsers.length && mMinDJsForSongLimit <= mDJs.length;
    else if(mMinSongLimitOperator && mMinUsersForSongLimit && mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && (mMinUsersForSongLimit <= mUsers.length || mMinDJsForSongLimit <= mDJs.length);
    else if(mMinUsersForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinUsersForSongLimit <= mUsers.length;
    else if(mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinDJsForSongLimit <= mDJs.length;
    else mSongLimitCurrentlyOn = mLimitOn;
    mParsing['{songlimitcurrentlyon}'] = mSongLimitCurrentlyOn ? "on" : "off";
};

global.CalculateSongLimit = function(){
    if(mSongLimitUserProportion)
        mCurrentSongLimit = Math.floor(mSongLimitUserProportion / mUsers.length);
    else
        mCurrentSongLimit = mMaxSongs;
    mParsing['{songlimit}'] = mCurrentSongLimit;
};

global.HandleCommand = function(pUser, pText){
    if(!mBooted) return;
    var sMatch = pText.match(/^[!\*\/]/);
    if(!sMatch && mBareCommands.indexOf(pText) === -1) return;
    var sSplit = pText.split(' ');
    var sCommand = sSplit[0].replace (/^[!\*\/]/, "").toLowerCase();
    pText = sSplit.join(' ');
    var sArgs =  Split(pText)[1];
    var sCommands = mCommands.filter(function(pCommand){ 
        return pCommand.command == sCommand; 
    });
    sCommands.forEach(function(pCommand){ 
        if(pCommand.requires.check(pUser)) 
            pCommand.callback(pUser, sArgs); 
    });
};

global.HandleMenu = function(pUser, pText){
    var sItems = mMenu.filter(function(pMenu){ 
        return pMenu.item == pText; 
    });
    sItems.forEach(function(pMenu){ 
            pMenu.callback(pUser, pText); 
    });
};

global.Split = function (pText) {
      var i = pText.search(/\s/);
      if (i === -1)  return [pText, ''];
      return [pText.substr(0, i), pText.substr(i).trimLeft()];
};

global.FindByName = function(pName){
    var Results = [];
    var sUserIDs = _.keys(mUsers);
    sUserIDs.splice(0,1);
    for(var i = 0; i < sUserIDs.length; ++i){
        var sUserID = sUserIDs[i];
        if(mUsers[sUserID].name.match(pName)){
            Results.push(mUsers[sUserID]);
        }
    }
    return Results;
}
global.Is_Moderator = function(pUser){return mModerators.indexOf(pUser.userid) != -1; }
global.Is_SuperUser = function(pUser){return pUser.acl > 0;}
global.Is_VIP = function(pUser){return mVIPs.indexOf(pUser.userid) != -1;}
global.Is_Owner = function(pUser){ return mOwners.indexOf(pUser.userid)!=-1; }

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
