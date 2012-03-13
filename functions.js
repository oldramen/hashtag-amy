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
    	if(sUser = mUsers[pData.user[i].userid]){
    		Log("Me Gusta.");
    	}else{
	    	RegisterUser(pData.user[i]); 
	    	mPushingOutGreeting.push(pData.user[i]); 
    	}
	}
	if(!mBooted && mUsers[pData.user[0].userid].IsBot()) BootUp();
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
    Update_Users(pData.users, false); 
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
    var sUser = mUsers[pData.user[0].userid];
    //sUser.Update(); ///Update_User(sUser, true);         /// Refreshing the information of the DJ that was added.
    mDJs.push(sUser.userid);
    if(mQueueCurrentlyOn) 
        if(!GuaranteeQueue(sUser)) return;      /// Guarantee that the next user in the queue is getting up.
    
    LonelyDJ();
    Speak(sUser, mAddDJ, SpeakingLevel.DJChange);
};

global.OnRemDJ = function(pData){
    //mBot.roomInfo(OnGotRoomInfo);
    var sUser = mUsers[pData.user[0].userid];
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
    if(mSongLimitCurrentlyOn && mCurrentDJ.songCount >= mCurrentSongLimit) OverMaxSongs(mCurrentDJ);
    mCurrentDJ = mUsers[pData.room.metadata.current_dj];
    mSongName = pData.room.metadata.current_song.metadata.song;
    if(mCurrentDJ) Increment_SongCount(mCurrentDJ);
};

global.OnSpeak = function(pData){
    var sUser = mUsers[pData.userid];
    var sText = pData.text;
    if(sUser == null) return;
    sUser.Update(); //Update_User(sUser, true);
    console.log(sUser.name+": "+sText);
    if(sText.match(/^[!*\/]/) || mBareCommands.indexOf(sText) !== -1) HandleCommand(sUser, sText);
};

global.OnPmmed = function(pData){
    if(mPMSpeak) HandlePM(mUsers[pData.senderid], pData.text);
};

global.OnSnagged = function(pData){
    //Do Hearts here.
}

global.OnVote = function(pData){
  mUpVotes = pData.room.metadata.upvotes;
  mDownVotes = pData.room.metadata.downvotes;
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
  var sMessage = mEndSong
  .replace(/\{songtitle\}/gi, mSongName)
  .replace(/\{up\}/gi, mUpVotes)
  .replace(/\{down\}/gi, mDownVotes);
  Speak(mCurrentDJ, sMessage, SpeakingLevel.Misc);
};

global.Loop = function(){
    CheckAFKs();
    CalculateProperties();
    var toGreet = _.filter(mUsers, function(e){ return mPushingOutGreeting.indexOf(e.userid) != -1; });
    if(toGreet) toGreet.forEach(function(e){ e.Greet(); });
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

global.SpeakingAllowed = function(pSpeakingLevel){
    if(mSpeakingLevel.flags.indexOf(SpeakingLevel.Verbose) != -1) return true;
    else return mSpeakingLevel.indexOf(pSpeakingLevel) != -1;
};

global.RefreshMetaData = function(pMetaData){
    if(pMetaData.current_song)
        mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i){
        mDJs[i] = pMetaData.djs[i];
        mUsers[mDJs[i]].songCount = 0;
    }
    mCurrentDJ = mUsers[pMetaData.current_dj];
    mIsModerator = pMetaData.moderator_id.indexOf(mUserId) != -1;
    mModerators = pMetaData.moderator_id;
    mMaxDJs = pMetaData.max_djs;
    /// WE HAVE TO DO A HELLAOFALOTMORE HERE.
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
    //mParsing['{owners}']                        = mOwners.join(', ');
    //mParsing['{vips}']                          = mVIPs.join(', ');
    mParsing['{waiter}']                       	= mWaiter ? "on" : "off";
    mParsing['{modbop}']                        = mModBop ? "on" : "off";
    mParsing['{queueamount}']                   = 0;
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
    if(!mAFK) return;
    for (i in mDJs) {
      var sUser = mUsers[mDJs[i]];
      if (sUser.CheckAFK()) sUser.BootAFK(sUser);
    }
};

global.LonelyDJ = function(){
    if(!mLonelyDJ){ return; }
    if(mDJs.length == 1 && (mDJs.indexOf(mUserId) == -1))
        mBot.addDj();
    if((mDJs.length > 2 || mDJs.length == 1 ) && (mDJs.indexOf(mUserId) != -1))
         mBot.remDj(); /// We could add ourselves to the justbooted, but it wouldn't matter since we can't talk about ourselves.
};

global.RegisterUser = function(pData){
	mUsers[pData.userid] = BaseUser().extend(pData);
	++mUsers.length;
	mMongoDB.collection("users").findOne({userid: pData.userid}, function(err,cursor){
		if(!cursor){
			Insert("users", mUsers[pData.userid]);
			return;
		}
		mUsers[pData.userid] = cursor.extend(pData);
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
	
	mMongoDB.collection("users").find({'userid': {'$in': sUserIDs}}, function(err, cursor){
		cursor.toArray(function(err,array){
			var toInsert = [];
			for(var i = 0; i < pUsers.length; ++i){
				var sUser = pUsers[i];
				
				var sRegistered = array.filter(function(e){ return e.userid === sUser.userid })
				if(sRegistered && sRegistered.length){
					mUsers[sUser.userid] = mUsers[sUser.userid].extend(sRegistered[0])
				}else{
					toInsert.push(mUsers[sUser.userid]);//Insert("users", mUsers[sUser.userid]);
					console.log("Inserting: " + sUser.name);
				}
			}
			//Insert("users", toInsert);
		});
	})
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
    var sCommand = sSplit.shift().replace(/^[!\*\/]/, "").toLowerCase();
    pText = sSplit.join(' ');
    var sCommands = mCommands.filter(function(pCommand){ 
        return pCommand.command == sCommand; 
    });
    sCommands.forEach(function(pCommand){ 
        if(pCommand.requires.check(pUser)) 
            pCommand.callback(pUser, pText); 
    });
};

global.HandlePM = function(pUser, pText){
    if(/*!mBooted || */!mPMSpeak) return; HandleCommand(puser, pText);
    /// Give me one good reason why this should be here.
    /*var sMatch = pText.match(/^[!\*\/]/);
    if(!sMatch && mBareCommands.indexOf(pText) === -1) return;
    var sSplit = pText.split(' ');
    var sCommand = sSplit.shift().replace(/^[!\*\/]/, "").toLowerCase();
    if(mPMCommands.indexOf(sCommand) === -1) return;
    pText = sSplit.join(' ');
    var sCommands = mCommands.filter(function(pCommand){ 
        return pCommand.command == sCommand; 
    });
    sCommands.forEach(function(pCommand){ 
        if(pCommand.requires.check(pUser)) 
            pCommand.callback(pUser, pText); 
    });*/
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

global.FindByName = function(pName){
	throw "TODO: FindByName."
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
};

global.mRandomItem = function (list) {
      return list[Math.floor(Math.random() * list.length)];
};

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

global.Save = function(pTo, pData){
	mMongoDB.collection(pTo).save(pData);
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
	laptop: "pc",
	afkWarned: false,
	afkTime: (new Date()).getTime(),
	songCount: 0,
	IsiOS: function(){ console.log(JSON.stringify(this)); return laptop === "iphone"; },
	CheckAFK : function(){
		var sWarn = mAFK * (0.693148);
    	var sAge = Date.now() - this.afkTime;
    	var sAge_Minutes = sAge / 60000; /// No Math.floor.  D:<
    	if (sAge_Minutes >= mAFK) return true;
    	if(!this.afkWarned && sAge_Minutes >= sWarn && mWarn){
    	    Speak(pUser, mWarnMsg, SpeakingLevel.Misc);
			this.afkWarned = true;
    	}
    	return false;
	},
	BootAFK : function(){
		this.RemoveDJ();
	    this.Speak(mRemDJMsg, SpeakingLevel.Misc);
	},
	Remove: function(){
	    delete mUsers[this.userid];
	    --mUsers.length;
	    if(mQueue.indexOf(pUser.userid) != -1){
	        mQueue.splice(mQueue.indexOf(this.userid),1);
	        ParsingForQueue();
	    }
	    mPushingOutGreeting.splice(mPushingOutGreeting.indexOf(this.userid),1);
	},
	PM: function(pSpeak, pSpeakingLevel, pArgs){
	    if(!pSpeak) return;
	    if(IsBot())
	    pSpeak = this.Parse(pSpeak, pArgs);
	    if(!mSpokenMessages.filter(function(e){ return e.message == pSpeak }).length){
	        if(SpeakingAllowed(pSpeakingLevel)) 
	            mBot.pm(pSpeak, pUser.userid);
	        mSpokenMessages.push({message: pSpeak, timestamp: (new Date()).getTime()});
	    }
	    return pSpeak;
	},
	IsBot: function(){ return this.userid == mUserId; },
	RemoveDJ: function(){
	    if(!mIsModerator) return;
	    if(!this.isDJ) return;
	    mJustRemovedDJ.push(this.userid);
	    mBot.remDj(this.userid);
	},
	OverMaxSongs : function(){
	    RemoveDJ();
	    Speak(this, mOverMaxSongsQueueOn, SpeakingLevel.Misc);
	},
	Greet : function(){
		var sGreeting = mDefaultGreeting;
	    var sOwnGreeting = mGreetings.filter(function(e){ return e.userid == this.userid; });
        if(sOwnGreeting && sOwnGreeting.length > 0){ 
            sGreeting = sOwnGreeting[0];
            Speak(this, sGreeting, SpeakingLevel.Greeting);
        }else if(Is_SuperUser()) sGreeting = mSuperGreeting;
        else if(Is_Moderator()) sGreeting = mModeratorGreeting;
        else if(Is_VIP()) sGreeting = mVIPGreeting;
	},
	Parse : function(pString, pArgs){
	    if(this && !this.length) pString = pString.replace(/\{username\}/gi, this.name); /// We obviously need the this here.
	    if(this && this.length && this.length > 0) {
	        var thiss = this[0].name;
	        var sJoin = ", ";
	        if(pString.match(/@\{usernames}/gi)) sJoin = ", @";
	        if(this.length > 1) thiss = _.reduce(this, function(thiss, thisNew){ 
	                return (typeof(thiss) == 'string' ? thiss : thiss.name) + sJoin + thisNew.name;
	        });
	        pString = pString.replace(/\{usernames\}/gi, thiss);
	    }
	    if(!mBooted) return pString; /// If we haven't booten up, don't bother even trying to use the variables.
	    var sVariables = pString.match(/\{[^\}]*\}/gi);
	    if(sVariables == null) return pString;
	    for(var i = 0; i < sVariables.length; ++i){
	        var sVar = sVariables[i];
	        if(mParsing[sVar] != null)
	            pString = pString.replace(sVar, mParsing[sVar]);
	    }
	    var thisnameVariables = pString.match(/\{username\.[^}]*\}/gi);
	    if(thisnameVariables)
	        for(var i = 0; i < thisnameVariables.length; ++i){
	            var sVar = thisnameVariables[i];
	            var thisVar = sVar.split('.')[1];
	            thisVar = thisVar.substring(0, thisVar.length-1);
	            if(this[thisVar] != null)
	                pString = pString.replace(sVar, this[thisVar]);
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
	},
	Increment_SongCount : function(){
	  ++this.songCount;
	  Log(this.name + "'s song count: " + this.songCount);
	},
	Speak : function(pSpeak, pSpeakingLevel, pArgs){
	    if(!pSpeak) return;
	    if(this.IsBot()) return;
	    pSpeak = this.Parse(pSpeak, pArgs);
	    if(!mSpokenMessages.filter(function(e){ return e.message == pSpeak }).length){
	        if(SpeakingAllowed(pSpeakingLevel)) 
	            mBot.speak(pSpeak);
	        mSpokenMessages.push({message: pSpeak, timestamp: (new Date()).getTime()});
	    }
	    return pSpeak;
	},
	Update : function(){
		/// Nope.avi
	}
};
};