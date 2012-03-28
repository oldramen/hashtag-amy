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
    for(var i = 0; i < pData.user.length; ++i){
    	var sUser = pData.user[i];
    	var sCached = mUsers[sUser.userid];
    	if(sCached){
    		if(mRecentlyLeft[sUser.userid]){
    			clearTimeout(sUser.userid);
    			delete mRecentlyLeft[sUser.userid];
    		}
    		mUsers[sUser.userid] = sCached; /// Just incase there's that slim chance that they got removed.
    	}else if(!sUser.isBanned)
	    	RegisterUser(pData.user[i]);
    	else if(sUser.isBanned) 
    		sUser.Boot(sUser.banReason ? sUser.banReason : mBanReason);
	}
	if(!mBooted && mUsers[pData.user[0].userid].IsBot()) BootUp();
    CalculateProperties();
};

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) mUsers[pData.user[i].userid].Remove();   //not quite done yet. 
    // pData.user[i].RecentlyLeft = Date.now();
    CalculateProperties();
};

global.OnGotRoomInfo = function(pData){
    Log("Got Room Data");
    mRoomName = pData.room.name;
    mRoomShortcut = pData.room.shortcut;
    InitMongoDB();
    Update_Users(pData.users, false);
    RefreshMetaData(pData.room.metadata);
};

global.OnNewModerator = function(pData){
    if(!pData.success) return;
    var sUser = mUsers[pData.userid];
    if(sUser.IsBot()) mIsModerator = true;
    else sUser.isMod = true;///mModerators[pData.userid] = true;
    if(sUser) Speak(mUsers[sUser], mAddMod, SpeakingLevel.MODChange);
    Log(sUser.name + " is now a moderator");
};

global.OnRemModerator = function(pData){
    if(!pData.success) return;
    var sUser = mUsers[pData.userid];
    if(sUser.IsBot()) mIsModerator = false;
    else sUser.isMod = false;///delete mModerators[pData.userid];
    if(sUser) Speak(sUser, mRemMod, SpeakingLevel.MODChange);
    Log(sUser.name + " is no longer a moderator");
};

global.OnAddDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);
    var sUser = mUsers[pData.user[0].userid];
    //sUser.Update(); ///Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
	mDJs.push(sUser.userid);
    sUser.isDJ = true;
    var sElapsedTimeMS = Date.now() - mDJDropTime;
    if(sElapsedTimeMS < mMaxElapsedTimeForDJSpot)
    	Speak(sUser, mSpotOpenFor, SpeakingLevel.Misc, [['{opentime}', sElapsedTimeMS / 1000]]);
	if(mReservedSpots.length > 0){
		var sIsInReserved = false;
		var sElements = [];
		mReservedSpots.forEach(function(e,i){ if(e.userid == sUser.userid){ sIsInReserved = true; sElements.push(e); } });
		sElements.forEach(function(e,i){ mReservedSpots.splice(mReservedSpots.indexOf(e), 1); });
		if(!sIsInReserved){
			sUser.allowedToReserveSpot = false;
			sUser.RemoveDJ();
		}
	}else sUser.allowedToReserveSpot = true;
    sUser.Update();
    if(mWhiteListEnabled && !sUser.whiteList && !sUser.IsBot()){
    	sUser.RemoveDJ();
    	sUser.PM(mNotOnWhiteList, SpeakingLevel.Misc)
	}
    if(mQueueCurrentlyOn) 
        if(!GuaranteeQueue(sUser)) return;      /// Guarantee that the next user in the queue is getting up.
    if(!mCurrentDJ) mCurrentDJ = sUser;
	LonelyDJ();
    Speak(sUser, mAddDJ, SpeakingLevel.DJChange);
};

global.OnRemDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);
    var sUser = mUsers[pData.user[0].userid];
    sUser.bootAfterSong = false;
    sUser.isDJ = false;
	mDJDropTime	= Date.now();
    sUser.Update();///Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    mDJs.splice(mDJs.indexOf(sUser.userid),1);
    LonelyDJ();
    if(mJustRemovedDJ.indexOf(sUser.userid) != -1)
        mJustRemovedDJ.splice(mJustRemovedDJ.indexOf(sUser.userid),1); /// Don't treat them like a normal DJ if we just forced them to step down.
    else
        Speak(sUser, mRemDJ, SpeakingLevel.DJChange);
    if(mQueueCurrentlyOn) QueueAdvance();        /// Advance the queue to the next person in line.
};

global.OnNewSong = function(pData){
	if(mCurrentDJ){
	    if(mSongLimitCurrentlyOn && mCurrentDJ.songCount >= mCurrentSongLimit) mCurrentDJ.OverMaxSongs(mCurrentDJ);
	    if(mCurrentDJ.bootAfterSong){ mCurrentDJ.RemoveDJ(); }
   	}
   	mParsing['{heartcount}'] = 0;
   	mCurrentSong.upVotes = 0;
   	mCurrentSong.downVotes = 0;
   	mCurrentSong.songName = pData.room.metadata.current_song.metadata.song;
    mCurrentDJ = mUsers[pData.room.metadata.current_dj];
    if(mCurrentDJ) mCurrentDJ.Increment_SongCount(mCurrentDJ);
    if(mUsingLonelyDJ && !mCheckSongCountWithLonely) mCurrentDJ.songCount = 0;
    if(mCurrentDJ.GetLevel() > 2 && mAutoBopForMods) setTimeout(function(){ mBot.vote("up"); }, 5000);
    var sUsersWaiting = _.keys(mWaitingSongLimit);
    for(var i = 0; i < sUsersWaiting.length; ++i){
    	var sUserId = sUsersWaiting[i];
    	--mWaitingSongLimit[sUserId];
    	if(!mWaitingSongLimit[sUserId]){
    		delete mWaitingSongLimit[sUserId];
    		mUsers[sUserId].songCount = 0;
    	}
    }
};

global.OnSpeak = function(pData){
    var sUser = mUsers[pData.userid];
    var sText = pData.text;
    if(sUser == null) return;
    sUser.Update(); //Update_User(sUser, true);
    console.log(sUser.name+": "+sText);
    if(sText.match(/^[!*\/]/) || mBareCommands.indexOf(sText) !== -1) HandleCommand(sUser, sText);
    CheckAutoBan(sUser, sText);
};

global.OnPmmed = function(pData){
    if (!mUsers[pData.senderid]) return;
    var sUser = mUsers[pData.senderid];
    console.log("(PM) " + sUser.name + ": " + pData.text);
    HandleCommand(mUsers[pData.senderid], pData.text, true);
};

global.OnSnagged = function(pData){
    //Do Hearts here.
    ++mCurrentSong.heartCount;
    mParsing["{heartcount}"] = mCurrentSong.heartCount
}

global.OnVote = function(pData){
  mCurrentSong.upVotes = pData.room.metadata.upvotes;
  mCurrentSong.downVotes = pData.room.metadata.downvotes;
  Log("Up: " + mCurrentSong.upVotes + " Down: " + mCurrentSong.downVotes);
  if (mAfkBop){
    var sVote = pData.room.metadata.votelog;
    var sVoters = [];
  	for (var _i = 0; _i < sVote.length; _i++) {
		var sVotes = sVote[_i]; 
		var sUserId = sVotes[0];
		var sUser = mUsers[sUserId];
		if (sUser && !sUser.IsBot()){
        	 sVoters.push(sUser.userid);
        	 ///Variable to update user on vote if configured?
    	}
	}
      return sVoters;
  }
};

global.OnEndSong = function(pData){
	Speak(mCurrentDJ, mEndSong, SpeakingLevel.Misc, [['{songtitle}', mCurrentSong.songName], ['{up}', mCurrentSong.upVotes], ['{down}', mCurrentSong.downVotes]]);
};

global.OnNoSong = function(pData){
	Log("There is currently no song");
}

global.Loop = function(){
    CheckAFKs();
    CalculateProperties();
    console.log(JSON.stringify(mPushingOutGreeting));
    Greet(mPushingOutGreeting);
    mPushingOutGreeting = [];
    RemoveOldMessages();
    var sPM = mPMQueue.shift();
    if(sPM) mBot.pm(sPM[0], sPM[1]);
    if(!mSaving){ 
    	mSaving = true;
		setTimeout(function(){
	    	var sKeys = _.keys(mUsers);
	    	for(var i = 0; i < sKeys.length; ++i){
	    		var sUser = mUsers[sKeys[i]];
	    		if(sUser.Save) sUser.Save();
	    	}
	    	mSaving = false;
    	}, mSaveTimeout * 1000);
    }
};

global.Greet = function(pUsers){
    var sDefaultGreetings = [];
    var sVIPGreetings = [];
    var sSuperUserGreetings = [];
    var sModeratorGreetings = [];
    for(var i = 0; i < pUsers.length; ++i){
        var pUser = pUsers[i];
        if(pUser.customGreeting){ 
            sGreeting = pUser.customGreeting;
            Speak(pUser, sGreeting, SpeakingLevel.Greeting);
        }else if(pUser.isSuperUser) sSuperUserGreetings.push(pUser);
        else if(pUser.isMod) sModeratorGreetings.push(pUser);
        else if(pUser.Vip) sVIPGreetings.push(pUser);
        else sDefaultGreetings.push(pUser);
    }
    if(sSuperUserGreetings.length > 0) Speak(sSuperUserGreetings, mSuperGreeting, SpeakingLevel.Greeting);
    if(sModeratorGreetings.length > 0) Speak(sModeratorGreetings, mModeratorGreeting, SpeakingLevel.Greeting);
    if(sVIPGreetings.length > 0) Speak(sVIPGreetings, mVIPGreeting, SpeakingLevel.Greeting);
    if(sDefaultGreetings.length > 0) Speak(sDefaultGreetings, mDefaultGreeting, SpeakingLevel.Greeting);
};

global.CheckAutoBan = function(pUser, pText){
	var joinedTimeAgo = Date.now() - pUser.joinedTime;
	if(mAutoBanOnTTLink){
		if(joinedTimeAgo < mAutoBanOnTTLinkTime && pText.match("(?:http://)?(?:www.)?turntable.fm/[^ ]+")) Ban(pUser, "Autobanned: spamming our room ("+pText+")", true);
	}
}

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

global.SpeakingAllowed = function(pSpeakingLevel){
    if(mSpeakingLevel.flags.indexOf(SpeakingLevel.Verbose) != -1) return true;
    else return mSpeakingLevel.indexOf(pSpeakingLevel) != -1;
};

global.Speak = function(pUser, pSpeak, pSpeakingLevel, pArgs, pPM){
    if(!pSpeak) return;
    if(pUser.IsBot && pUser.IsBot()) return;
    var sIsSelf = false;
    if(pUser && pUser.length) pUser.forEach(function(e){ sIsSelf = sIsSelf || (e.IsBot && e.IsBot()); });
    if(sIsSelf) return;
    pSpeak = Parse(pUser, pSpeak, pArgs);
    if(!mSpokenMessages.filter(function(e){ return e.message == pSpeak }).length){
        if(SpeakingAllowed(pSpeakingLevel)) 
            if (pPM && CanPM(pUser)) mBot.pm(pSpeak, pUser.userid);
            else mBot.speak(pSpeak);
        mSpokenMessages.push({message: pSpeak, timestamp: (new Date()).getTime()});
    }
};

global.RefreshMetaData = function(pMetaData){
    if(pMetaData.current_song)
        mCurrentSong.songName = pMetaData.current_song.metadata.song;
    mCurrentSong.upVotes = pMetaData.upvotes;
    mCurrentSong.downVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i){
        mDJs[i] = pMetaData.djs[i];
        mUsers[mDJs[i]].songCount = 0;
        mUsers[mDJs[i]].isDJ = true;
    }
    mCurrentDJ = mUsers[pMetaData.current_dj];
    mIsModerator = pMetaData.moderator_id.indexOf(mUserId) != -1;
    mModerators = mModerators.concat(pMetaData.moderator_id);
    for(var i = 0, len = pMetaData.moderator_id; i < len; ++i)
    	if(mModerators.indexOf(pMetaData.moderator_id[i]) == -1) mModerators.push(pMetaData.moderator_id[i]);
    mMaxDJs = pMetaData.max_djs;
    mCreator = pMetaData.creator.userid;
    mOwners.push(mCreator);
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
    mParsing['{room}'] = mParsing['{roomname}'] = mRoomName;
    mParsing['{theme}']                         = mTheme;
    mParsing['{songlimit}']                     = mCurrentSongLimit;
    mParsing['{queue}']                         = mQueueOn ? "on" : "off";
    mParsing['{afklimit}'] = mParsing['{afk}']  = mAFK;
    mParsing['{songwait}']                      = mWaitSongs;
    mParsing['{queuecurrentlyon}']              = mQueueCurrentlyOn ? "on" : "off";
    mParsing['{songlimitcurrentlyon}']          = mSongLimitCurrentlyOn ? "on" : "off";
    //mParsing['{owners}']                        = mOwners.join(', ');
    //mParsing['{vips}']                          = mVIPs.join(', ');
    mParsing['{waiter}']                       	= mWaiter ? "on" : "off";
    mParsing['{modbop}']                        = mModBop ? "on" : "off";
    mParsing['{queueamount}']                   = 0;
    mParsing['{heartcount}']					= 0;
    Log("Updated Parsing Library");
};

global.SetMyName = function(pName){
    mBot.modifyProfile({ name: pName });
    mBot.modifyName(pName);
};
global.SetLaptop = function(){
    mBot.modifyLaptop(mLaptop);
};

global.CheckAFKs = function(){
    if(!mAFK || (mUsingLonelyDJ && !mCheckAFKWithLonely)) return;
    for (i in mDJs) {
      var sUser = mUsers[mDJs[i]];
      if (sUser.CheckAFK()) sUser.BootAFK(sUser);
    }
};

global.LonelyDJ = function(){
    if(!mLonelyDJ){ return; }
    if(mDJs.length == 1 && mDJs.indexOf(mUserId) == -1){
        mBot.addDj();
        mUsingLonelyDJ = true;
   	}else if((mDJs.length > 2 || mDJs.length == 1 ) && mDJs.indexOf(mUserId) != -1){
		mBot.remDj(); /// We could add ourselves to the just booted, but it wouldn't matter since we can't talk about ourselves.
		mUsingLonelyDJ = false;
    }
};

global.RegisterUser = function(pData){
	mPushingOutGreeting.push(pData.userid); 
	mUsers[pData.userid] = BaseUser().extend(pData);
	++mUsers.length;
	if(!mBooted){
		mBootedQueue.push(function(){ RegisterUser(pData); });
		return;
	}
	if(mMongoDB)
		mMongoDB.collection(mRoomShortcut).findOne({userid: pData.userid}, function(err,cursor){
			if(!cursor){
				var sUser = mUsers[pData.userid];
				Log("Inserting: " + sUser.name);
				Insert(mRoomShortcut, sUser, function(err, records){
					if(!records || records.length != 1) { Log("Error inserting " + pData.name); return; }
					var sRecord = records[0]; /// There should only be one.  |:
					sUser.PM(mInfoOnRoom, SpeakingLevel.Greeting);
					sUser.Initialize();
					sUser.Set_ID(sRecord._id);
				});
				return;
			}
			var sUser = mUsers[pData.userid] = mUsers[pData.userid].extend(cursor.extend(pData));
			sUser.Initialize();
			sUser.Set_ID(cursor._id);
		});
};

global.RegisterUsers = function(pUsers){
	if(!pUsers || !pUsers.length) return;
	var sUserIDs = [];
	for(var i = 0; i < pUsers.length; ++i){
		var sUser = pUsers[i];
		mUsers[sUser.userid] = BaseUser().extend(sUser);
		++mUsers.length;
		sUserIDs.push(sUser.userid);
	}
	if(!mMongoDB) return;
		mMongoDB.collection(mRoomShortcut).find({'userid': {'$in': sUserIDs}}, function(err, cursor){
			Log("Registering Users");
			if(!cursor) return;
			cursor.toArray(function(err,array){
				var toInsert = [];
				for(var i = 0; i < pUsers.length; ++i){
					var sUser = pUsers[i];
					var sRegistered = array.filter(function(e){ return e.userid === sUser.userid })
					if(sRegistered && sRegistered.length){
						mUsers[sUser.userid] = mUsers[sUser.userid].extend(sRegistered[0].extend(sUser));
						mUsers[sUser.userid].Initialize();
						mUsers[sUser.userid].Set_ID(sRegistered[0]._id);
					}else{
						toInsert.push(mUsers[sUser.userid]);//Insert(mRoomShortcut, mUsers[sUser.userid]);
					}
				}
				if(toInsert.length)
					Insert(mRoomShortcut, toInsert, function(err, records){
						if(!records) return;
						for(var i = 0; i < records.length; ++i){
							var sRecord = records[i];
							mUsers[sRecord.userid] = mUsers[sRecord.userid].extend(sRecord);
							mUsers[sRecord.userid].Initialize();
							//Log("Inserted: " + sUser.name + "("+sRecord.name+")");
							mUsers[sRecord.userid].Set_ID(sRecord._id); //_id = sRecord._id;
							mUsers[sRecord.userid].PM(mInfoOnRoom, SpeakingLevel.Greeting);
						}
					});
			});
		});
};

global.Update_Users = function(pUsers, pSingle){
	var sRegisteringUsers = [];
	for(var i = 0; i < pUsers.length; ++i){
		var sUser = pUsers[i];
		if(!mUsers[sUser.userid]){
			sRegisteringUsers.push(sUser);
		}else {
			mUsers[sUser.userid] = mUsers[sUser.userid].extend(sUser);
			if(pSingle)	mUsers[sUser.userid].Update(); /// TODO: Make this
		}
	}
	if(sRegisteringUsers && sRegisteringUsers.length) RegisterUsers(sRegisteringUsers);
};

global.CalculateProperties = function(){
    IsSongQueueEnabled();
    IsSongLimitEnabled();
    IsAFKLimitEnabled();
    CalculateSongLimit();
};
global.IsSongQueueEnabled = function(){
    if(mMinQueueOperator == "&" && mMinUsersForQueue && mMinDJsForQueue)
        mQueueCurrentlyOn = mQueueOn && mMinUsersForQueue <= mUsers.length && mMinDJsForQueue <= mDJs.length;
    else if(mMinUsersForQueue && mMinDJsForQueue)
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
    else if(mMinUsersForSongLimit && mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && (mMinUsersForSongLimit <= mUsers.length || mMinDJsForSongLimit <= mDJs.length);
    else if(mMinUsersForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinUsersForSongLimit <= mUsers.length;
    else if(mMinDJsForSongLimit)
        mSongLimitCurrentlyOn = mLimitOn && mMinDJsForSongLimit <= mDJs.length;
    else mSongLimitCurrentlyOn = mLimitOn;
    mParsing['{songlimitcurrentlyon}'] = mSongLimitCurrentlyOn ? "on" : "off";
};
global.IsAFKLimitEnabled = function(){
	if(mMinAFKLimitOperator == "&" && mMinUsersForAFKLimit && mMinDJsForAFKLimit)
		mAFKLimitCurrentlyOn = mAFK && mUsers.length >= mMinUsersForAFKLimit && mDJs.length >= mMinDJsForAFKLimit;
   	else if(mMinUsersForAFKLimit && mMinDJsForAFKLimit)
        mAFKLimitCurrentlyOn = mAFK && (mMinUsersForAFKLimit <= mUsers.length || mMinDJsForAFKLimit <= mDJs.length);
	else if(mMinUsersForAFKLimit)
        mAFKLimitCurrentlyOn = mAFK && mMinUsersForAFKLimit <= mUsers.length;
	else if(mMinDJsForAFKLimit)
        mAFKLimitCurrentlyOn = mAFK && mMinDJsForAFKLimit <= mDJs.length;
	else mAFKLimitCurrentlyOn = !!mAFK;
    mParsing['{afklimitcurrentlyon}'] = mAFKLimitCurrentlyOn ? "on" : "off";
    //Log("AFK Limit currently: " + mAFKLimitCurrentlyOn ? "on" : "off");
}
global.CalculateSongLimit = function(){
    if(mSongLimitUserProportion)
        mCurrentSongLimit = Math.floor(mSongLimitUserProportion / mUsers.length);
    else
        mCurrentSongLimit = mMaxSongs;
    mParsing['{songlimit}'] = mCurrentSongLimit;
};

global.HandleCommand = function(pUser, pText, pPM){
    if(!mBooted) return;
    if (pPM && !mPMSpeak) return;
    var sMatch = pText.match(/^[!\*\/]/);
    if(!sMatch && mBareCommands.indexOf(pText) === -1) return;
    var sSplit = pText.split(' ');
    var sCommand = sSplit.shift().replace(/^[!\*\/]/, "").toLowerCase();
    if(pPM && mPMCommands.indexOf(sCommand) === -1) return;
    pText = sSplit.join(' ');
    var sCommands = mCommands.filter(function(pCommand){ 
        return (pCommand.command && pCommand.command == sCommand) || (typeof(pCommand.command) == "object" && pCommand.command.length && pCommand.command.indexOf(sCommand) != -1);
    });
    sCommands.forEach(function(pCommand){ 
        if(pCommand.requires.check(pUser))
            pCommand.callback(pUser, pText);
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

global.CanPM = function(pUser) {
    if (!mPMSpeak) return false;
    if (!pUser.IsiOS()) return true;
    else return false;
}

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
    var sUsernameVariables = pString.match(/\{user\.[^}]*\}/gi);
    if(sUsernameVariables)
        for(var i = 0; i < sUsernameVariables.length; ++i){
            var sVar = sUsernameVariables[i];
            var sUserVar = sVar.split('.')[1];
            sUserVar = sUserVar.substring(0, sUserVar.length-1);
            if(pUser[sUserVar] != null)
                pString = pString.replace(sVar, pUser[sUserVar]);
        }
    if(pArgs && pArgs.length){
        for(var i = 0; i < pArgs.length; ++i)
        {
            var sArg = pArgs[i];
            var sParameter = null;
            var sValue = null;
            if(sArg.length && sArg.length == 2){
                sParameter = sArg[0];
                sValue = sArg[1];
            }else if(sArg.parameter && sArg.value){
                sParameter = sArg.parameter;
                sValue = sArg.value;
            }
            if(sParameter != null && sValue != null) pString = pString.replace(sParameter, sValue);
        }
    }
    return pString;
};

global.FindByName = function(pName, pCallback){
	if(!pCallback){ 
		Log("Was going to find by name, but no callback, so returning");
		return;
	}
	pName = pName.replace("@", "^").trimRight() + "$";
	Log("Finding by name: " + pName);
	if(mMongoDB){
		mMongoDB.collection(mRoomShortcut).find({'name': {'$regex': pName}}, function(err, cursor){
			cursor.toArray(function(err,array){
				var sResults = {};
				array.forEach(function(e){
					sResults[e.userid] = BaseUser().extend(e);
				});
			    var sUserIDs = _.keys(mUsers);
			    sUserIDs.splice(0,1);
			    for(var i = 0; i < sUserIDs.length; ++i){
			        var sUserID = sUserIDs[i];
			        if(mUsers[sUserID].name.match(pName)){
			            //Results.push(mUsers[sUserID]);
			            if(sResults[sUserID]) sResults[sUserID] = sResults[sUserID].extend(mUsers[sUserID]);
			            else sResults[sUserID] = mUsers[sUserID];
			        }
			    }
			    pCallback(_.values(sResults));
			});
	 	});
	 }else{
	 	var sResults = {};
	 	var sUserIDs = _.keys(mUsers);
	    sUserIDs.splice(0,1);
	    for(var i = 0; i < sUserIDs.length; ++i){
	        var sUserID = sUserIDs[i];
	        if(mUsers[sUserID].name.match(pName)){
	            //Results.push(mUsers[sUserID]);
	            if(sResults[sUserID]) sResults[sUserID] = sResults[sUserID].extend(mUsers[sUserID]);
	            else sResults[sUserID] = mUsers[sUserID];
	        }
	    }
	 	pCallback(_.values(sResults));
	 }
};
global.Ban = function(pName, pReason, pAuto){
	if(pAuto && mAutoBanBoots && pName.userid){
		pName.Boot(pReason);
		return;
	}
	Log("Banning " + pName + " for: " + pReason);
	if(pName.name){
		var sUser = pName;
		if(sUser.GetLevel() > 2) return;
		    
	    sUser.isBanned = true;
	    sUser.banReason = pReason;
	    Speak(sUser, mBanned, SpeakingLevel.Misc);
	    sUser.Update();
	    sUser.Boot(pReason ? pReason : mBanReason);
	}else{
		FindByName(pName, function(sUser){
		    if(sUser.length > 0) sUser = sUser[0];
		    else return;
		    if(sUser.GetLevel() > 2) return;
		    
		    Log("Banning: " + sUser.name);
		    
		    sUser.isBanned = true;
		    sUser.banReason = pReason;
		    Speak(sUser, mBanned, SpeakingLevel.Misc);
		    sUser.Update();
		    sUser.Boot(pReason ? pReason : mBanReason);
	   	});
   }
}
global.Unban = function(pName){
	FindByName(pName, function(sUser){
	    if(sUser.length > 0) sUser = sUser[0];
	    else return;
	    sUser.isBanned = false;
	    delete sUser.banReason;
	    Speak(sUser, mUnbanned, SpeakingLevel.Misc);
	    sUser.Update();
    });
}
global.mRandomItem = function (list) {
      return list[Math.floor(Math.random() * list.length)];
};

global.InitMongoDB = function(){
    var sConnectionString = mMongoHost+":"+mMongoPort+"/"+mMongoDatabase+"?auto_reconnect";
    if(mMongoUser && mMongoPass) sConnectionString = mMongoUser+':'+mMongoPass+"@"+sConnectionString;
    Log("Connecting to: " + sConnectionString);
    if(mMongoHost && mMongoDatabase)
    	mMongoDB = mMongo.db(sConnectionString);
	else mMongoDB = null;
};

global.Refresh = function(pFrom, pCallback){
	if(!mMongoDB) return;
    if(!pFrom) return;
    var sCollection = mMongoDB.collection(pFrom);
    if(!sCollection) return false;
    sCollection.find().toArray(pCallback);
    return true;
};

global.Insert = function(pTo, pData, pCallback){
	if(!mMongoDB) return;
	if(pTo && pData)
    	mMongoDB.collection(pTo).insert(pData, pCallback? {safe:true} : {safe:false}, pCallback);
};

global.Remove = function(pFrom, pData, pCallback){
	if(!mMongoDB) return;
	if(pFrom)
    	mMongoDB.collection(pFrom).remove(pData, pCallback ? {safe: true} : null, pCallback);
};

global.Save = function(pTo, pData){
	if(!mMongoDB) return;
	mMongoDB.collection(pTo).removeById(pData._id, {safe: true}, function(err,cur){
		Insert(pTo, pData);
	});
}

Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    value: function(from) {
        var props = Object.getOwnPropertyNames(from);
        var dest = this;
        props.forEach(function(name) {
            if (name in dest) {
                var destination = Object.getOwnPropertyDescriptor(from, name);
                Object.defineProperty(dest, name, destination);
            }
        });
        return this;
    }
});

BaseUser = function(){return {
	userid: -1,
	name: "I said what what",
	isBanned: false,
	isMod: false,
	isOwner: false,
	isVip: false,
	isSuperUser: false,
	isDJ: false,
	laptop: "pc",
	afkWarned: false,
	afkTime: Date.now(),
	songCount: 0,
	totalSongCount: 0,
	customGreeting: null,
	bootAfterSong: false,
	joinedTime: Date.now(),
	whiteList: false,
	allowedToReserveSpot: true,
	Boot: function(pReason){ mBot.bootUser(this.userid, pReason ? pReason : ""); },
	IsiOS: function(){ return this.laptop === "iphone"; },
	CheckAFK : function(){
		if(!mAFKLimitCurrentlyOn || this.GetLevel() > 1) return false; /// Because idgaf.
    	var sAge = Date.now() - this.afkTime;
    	var sAge_Minutes = sAge / 60000; /// No Math.floor.  D:<
    	if (sAge_Minutes >= mAFK) return true;
    	if(!this.afkWarned && sAge_Minutes >= mAFKWarn && mWarn){
    	    Speak(this, mWarnMsg, SpeakingLevel.Misc);
			this.afkWarned = true;
    	}
    	return false;
	},
	BootAFK : function(){
	    Speak(this, mRemDJMsg, SpeakingLevel.Misc);
		this.RemoveDJ();
	},
	PM: function(pSpeak, pSpeakingLevel, pArgs){
	    if(!pSpeak) return;
	    if(this.IsBot()) return;
	    pSpeak = Parse(this, pSpeak, pArgs);
        if(SpeakingAllowed(pSpeakingLevel)) 
            mPMQueue.push([pSpeak, this.userid]);//mBot.pm(pSpeak, this.userid);
        mSpokenMessages.push({message: pSpeak, timestamp: (new Date()).getTime()});
    	return pSpeak;
	},
	IsBot: function(){ return this.userid == mUserId; },
	RemoveDJ: function(){
	    if(!mIsModerator || !this.isDJ || this.IsBot()) return;
	    mJustRemovedDJ.push(this.userid);
	    mBot.remDj(this.userid);
	},
	OverMaxSongs : function(){
	    this.RemoveDJ();
	    Speak(this, mOverMaxSongsQueueOn, SpeakingLevel.Misc);
	    mWaitingSongLimit[this.userid] = mWaitSongs;
	},
	Increment_SongCount : function(){
	  ++this.songCount;
	  ++this.totalSongCount;
	  Log(this.name + "'s song count: " + this.songCount + " total of: " + this.totalSongCount);
	},
	Update : function(){
		this.afkTime = Date.now();
		this.afkWarned = false;
		this.Save();///Save(mRoomShortcut, this);
	},
	Remove: function(){
		//delete mUsers[this.userid];
		var sUserId = this.userid;
		mRecentlyLeft[sUserId] = setTimeout(function(){
			if(!mRecentlyLeft[sUserId]) return;
			delete mUsers[sUserId];
			delete mRecentlyLeft[sUserId];
		}, mTimeForCacheFlush);
		this.Save();///Save(mRoomShortcut, this);
	},
	Initialize: function(){
		this.songCount = 0;
		this.afkTime = Date.now();
		this.afkWarned = false;
		this.bootAfterSong = false;
		this.isDJ = mDJs.indexOf(this.userid) != -1;
		this.isMod = mModerators.indexOf(this.userid) != -1;
		this.isOwner = mOwners.indexOf(this.userid) != -1;
		this.isVip = mVIPs.indexOf(this.userid) != -1;
		this.isSuperUser = this.acl > 0;
		this.joinedTime = Date.now();
		this.whiteList = mWhiteList.indexOf(this.userid) != -1;
		this.UpdateToLatest();
		this.Save();
	},
	GetLevel: function(){
		if(this.isOwner) return 5;
		if(this.isSuperUser) return 4;
		if(this.isMod) return 3;
		if(this.isVip) return 2;
		if(this.isDJ) return 1;
		if(this.isBanned) return -1;
		return 0;
	},
	Save: function(){
		if(!mMongoDB) return;
		if(this._id){
			Save(mRoomShortcut, this);
			return;
		}
		if(this.saveToken) return;
		Object.defineProperty(this, "saveToken",{
			enumerable: false,
			value: setInterval(function(){
				if(!this._id) return;
				Log("Delayed saving of " + this.name);
				Save(mRoomShortcut, this);
				var sSaveToken = this.saveToken;
				delete this.saveToken;
				clearInterval(sSaveToken);
			})
		},100);
	},
	Set_ID: function(pId){
		//Log(this.name + " : " + pId);
		this._id = pId;
	},
	UpdateToLatest: function(){
		var sLatest = BaseUser;
		for(var sVariable in sLatest){
			if(!this.hasOwnProperty(sVariable))
				this[sVariable] = sLatest[sVariable];
		}
	}
};
};