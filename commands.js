
/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 * @note All commands must be entirely lower case.
 * 
 * @variables:
 * hidden - whether or not the command shows up in the /command list
 * bare - whether or not the command can be accessed without an idetifier. ( ie / or *)
 * pm - whether or not the command will be processed if it is PM'd to the bot [mPMSpeak must be enabled]
 */

global.mCommands = [
    { 
        command: 'help',
        callback: function(pUser, pText){
            Speak(pUser, mHelpMsg, SpeakingLevel.Misc, null, true);
        }, 
        requires: Requires.User,
        hint: "Gives the users some pretty basic help and advice.",
        bare: true,
        pm: true
    },
    { 
        command: 'crash',
        callback: function () { TheBotWillCrash=IfWeTryTo.exec(AVarThatDoesntExist) },
        requires: Requires.Owner,
        hint: "Crashes the bot. Don't do unless necessary."
    },
    {
        command: 'ban',
        callback: function(pUser, pText){
        	var sSplit = pText.split(' ');
        	if(sSplit.length == 1)
            	Ban(sSplit[0]);
        	else Ban(sSplit.shift(), sSplit.join(' '));
        },
        requires: Requires.Moderator, 
        hint: "Add a user to the ban list and kicks them from the room."
    },
    {
        command: 'unban',
        callback: function(pUser, pText){
        	if(pText)
            	Unban(pText);
        },
        requires: Requires.Moderator, 
        hint: "Removes a user from the ban list."
    },
    {
        command: 'say',        
        callback: function(pUser, pText){
            mBot.speak(pText);
        }, 
        requires: Requires.Owner, 
        hint: "Makes the bot say something.",
        pm: true,
        bare: true
    },
    {
        command: 'q+',
        callback: function(pUser, pText){
            if(mDJs.indexOf(pUser.userid) != -1) {
                Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
            }else if(mQueue.indexOf(pUser.userid) != -1) {
                Speak(pUser, mAlreadyInQueue, SpeakingLevel.Misc);
            }else if(mDJs.length == mMaxDJs){
                QueuePush(pUser.userid);
                Speak(pUser, mQueueAdded, SpeakingLevel.Misc);
            }else Speak(pUser, mOpenSpotNoQueueing, SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "Used to join the queue.",
        bare: true
    },
    {
        command: 'q-',
        callback: function(pUser, pText){
            if(mDJs.indexOf(pUser.userid) != -1) {
                Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
            }else if(mQueue.indexOf(pUser.userid) != -1) {
                mQueue.splice(mQueue.indexOf(pUser.userid), 1);
                Speak(pUser, mRemoveFromQueue, SpeakingLevel.Misc);
            }else Speak(pUser, mNotInQueue, SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "Used to remove from the queue.",
        bare: true
    },
    {
        command: 'q',          
        callback: function(pUser, pText){
            if(!mQueueCurrentlyOn)
                Speak(pUser, mQueueOff, SpeakingLevel.Misc);
            else if(mQueue.length > 0)
                Speak(pUser, mQueueUsers, SpeakingLevel.Misc);
            else
                Speak(pUser, mQueueEmpty, SpeakingLevel.Misc)
        }, 
        requires: Requires.User, 
        hint: "Tells what the current status of the queue is.",
        bare: true
    },
    {
        command: 'punch',
        callback: function(pUser, pText){
            if(mQueue.length > 0) {
              if (!pText) {
              	  var sUser = mUsers[mQueue[0]];
                  Speak(sUser, mModRemoveFromQueue, SpeakingLevel.Misc);//mBot.speak(mModRemoveFromQueue.replace(/\{user\}/g, mUsers[mQueue[0]].name));
                  mQueue.shift();
                }else {
                  FindByName(pText,function(sUser){
                    for(var i = 0; i < sUser.length; ++i) {
                       if(mQueue.indexOf(sUser[i].userid) === -1) return;
                        if (sUser[i] == mUsers[mQueue[0]]) {
                            mQueue.shift();
                            return Speak(sUser[i], mModRemoveFromQueue, SpeakingLevel.Misc);
                        } else {
                            mQueue.splice(mQueue.indexOf(sUser[i].userid), 1);
                            return Speak(sUser[i], mModRemoveFromQueue, SpeakingLevel.Misc);
                        }
                       }
                    });
                };
            };
        }, 
        requires: Requires.Moderator, 
        hint: "Removes users from the queue"
    },
    {
        command: 'qstatus',
        callback: function(pUser, pText){
            if(!mQueueCurrentlyOn)
                Speak(pUser, mQueueOff, SpeakingLevel.Misc);
            else if(mQueue.length > 0)
                Speak(pUser, mQueueStatus, SpeakingLevel.Misc);
            else
                Speak(pUser, mQueueEmpty, SpeakingLevel.Misc) 
        },
        requires: Requires.User,
        hint: "Tells you the amount of people in the queue."
    },
    {
        command: 'maul',
        callback: function(pUser, pText){
            FindByName(pText,function(sUser){
	            for(var i = 0; i < sUser.length; ++i)
	                mBot.remDj(sUser[i].userid);
         	});
        },
        requires: Requires.Moderator,
        hint: "Remove a DJ"
    },
    {
        command: 'gtfo',
        callback: function(pUser, pText){
            FindByName(pText, function(sUser){
	            if(sUser.length > 0) sUser = sUser[0];
	                mBot.bootUser(sUser.userid, "Not in my kitchen.");
            });
        },
        requires: Requires.Moderator,
        hint: "Boot a User"
    },
    {
        command: 'slap',
        callback: function(pUser, pText){
            FindByName(pText, function(sUser){
            	if(sUser.length > 0){
                	sUser = sUser[0];
                    Speak(sUser, '/me slaps {username}', SpeakingLevel.Misc);
               }
            });
        },
        requires: Requires.Moderator,
        hint: "Slap a ho",
        pm: true
    },
    {
        command: 'stagedive',
        message: ["{username} is surfing the crowd!", "Oops! {username} lost a shoe sufing the crowd.", "Wooo! {username}'s surfin' the crowd! Now to figure out where the wheelchair came from...", "Well, {username} is surfing the crowd, but where did they get a raft...", "{username} dived off the stage...too bad no one in the audience caught them.", "{username} tried to jump off the stage, but kicked their laptop. Ouch.", "{username} said they were going to do a stagedive, but they just walked off.", "And {username} is surfing the crowd! But why are they shirtless?", "{username} just traumatized us all by squashing that poor kid up front."],
        callback: function(pUser, pText){
            if(mDJs.indexOf(pUser.userid) == -1) return;
            var sMessage = mRandomItem(this.message);
            Speak(pUser, sMessage, SpeakingLevel.Misc);
            pUser.RemoveDJ();
        },
        requires: Requires.User,
        hint: "Removes if DJ"
    },
    {
        command: 'ragequit',
        callback: function(pUser, pText){
                mBot.bootUser(pUser.userid, "Not in my kitchen.");
        },
        requires: Requires.User,
        hint: "Remove self from room"
    },
    {
        command: 'disable',
        callback: function(pUser, pText){
            eval(pText + " = null");
        },
        requires: Requires.Owner,
        hint: "Used to disable variables.  Handle with care."
    },
    {
        command: 'djs',
        callback: function(pUser, pText){
            var sDJSongCount = [];
            for(var sDJ in mDJs){
            	var sUser = mUsers[mDJs[sDJ]];
            	sDJSongCount.push(sUser.name + ": " + sUser.songCount);
            }
            Speak(pUser, mCurrentDJSongCount, SpeakingLevel.Misc,[['{djsandsongcount}', sDJSongCount.join(', ')]]);
        },
        requires: Requires.User,
        hint: "Tells the current song count for the DJs."
    },
    {
        command: 'afks',
        callback: function(pUser, pText){
            var sDJAfkCount = [];
            for(var sDJ in mDJs){
                var sUser = mUsers[mDJs[sDJ]];
                var sAfkTime = sUser.afkTime;              
                var sAge = Date.now() - sAfkTime;
                var sAge_Minutes = Math.floor(sAge / 1000 / 60);
                sDJAfkCount.push(sUser.name + ": " + sAge_Minutes+'m');
            }
            Speak(pUser, mCurrentDJAfkCount, SpeakingLevel.Misc,[['{djsandafkcount}', sDJAfkCount.join(', ')]]);
        },
        requires: Requires.User,
        hint: "Tells the current afk timer for the DJs."
    },
    {
        command: 'commands',
        callback: function(pUser, pText){
            var sCommands = [];
            mCommands.forEach(function(pCommand){
                if(pCommand.requires.check(pUser) && !(pCommand.hidden))
                    sCommands.push(pCommand.command);
            });
            Speak(pUser, mCommandsList, SpeakingLevel.Misc, [['{commands}', sCommands.join(', /')]], true);
        },
        requires: Requires.User,
        hint: "Tells what all the commands are.",
        pm: true
    },
    {
        command: 'theme',
        callback: function(pUser, pText){
            Speak(pUser, mThemeIs, SpeakingLevel.Misc, null, true);
        },
        requires: Requires.User,
        hint: "Tells what the theme is.",
        bare: true,
        pm: true
    },
    {
        command: 'party',
        message: 'Gimme a shot and clear the dance floor!!',
        callback: function(pUser, pText){
            mBot.vote("up");
            Speak(pUser, this.message, SpeakingLevel.Misc);
        },
        requires: mModBop ? Requires.Moderator : Requires.User,
        hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : "")
    },
    {
        command: ['dance','bop'],
        message: 'Bust a move!',
        callback: function(pUser, pText){
            mBot.vote("up");
            Speak(pUser, this.message, SpeakingLevel.Misc);
        },
        requires: mModBop ? Requires.Moderator : Requires.User,
        hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : "")
    },
    {
        command: 'hulk',
        message: ['This is my favorite dubstep.', 'I just want to hump the speaker.'],
        callback: function(pUser, pText){
            mBot.vote("up");
            mBot.speak(mRandomItem(this.message));
        },
        requires: Requires.Moderator,
        hint: "Makes the bot dance.  Can not be done by regular users."
    },
    {
        command: 'moo',
        callback: function(pUser, pText){
            Speak(pUser, "I'm not a cow, but oka-MOOOOO!", SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "moo.",
        hidden:true
    },
    {
        command: 'pats',
        callback: function(pUser, pText){
            Speak(pUser, "/me purrrrrrrrrrrrs", SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "pats.",
        hidden:true
    },
    {
        command: 'order',
        callback: function(pUser, pText){
            HandleMenu(pUser, pText);
        }, 
        requires: Requires.User, 
        hint: "Order something off the menu."
    },
    {
    	command: 'bootaftersong',
    	callback: function(pUser, pText){
    		if(pUser.isDJ){
    			pUser.bootAfterSong = true;
    			pUser.PM(mPMWillBootOffDeck, SpeakingLevel.Misc);
			}else pUser.PM(mNotDJ, SpeakingLevel.Misc);
    	},
    	requires: Requires.User,
    	hint: "Removes the user from the deck after their song is over."
    },
    {
    	command: 'vip',
    	callback: function(pUser, pText){
    		FindByName(pText, function(sUser){
    			if(sUser.length != 1) return;
    			sUser = sUser[0]
	    		sUser.isVip = true;
	    		Speak(sUser, mIsNowVIP, SpeakingLevel.Misc);
    		});
    	},
    	requires: Requires.Moderator,
    	hint: "Makes a user a VIP"
    },
    {
    	command: 'unvip',
    	callback: function(pUser, pText){
    		FindByName(pText, function(sUser){
	    		sUser.isVip = false;
	    		Speak(sUser, mIsNoLongerVIP, SpeakingLevel.Misc);
    		});
    	},
    	requires: Requires.Moderator,
    	hint: "Makes a user not a VIP"
    },
    {
        command: 'setvar',
        callback: function(pUser, pText){
            if (!pText) return;
            var sSplit = pText.split(' ');
            var sVariable = sSplit.shift();
            var sValue = sSplit.join(' ');
            Log("Setting " + sVariable + " to have the value of " + sValue);
            eval(sVariable + ' = ' + sValue);
        },
        requires: Requires.Owner,
        hint: "Temporarily changes options"
    },
    {
        command: 'disable',
        callback: function(pUser, pText){
            eval(pText + " = null");
        },
        requires: Requires.Owner,
        hint: "Used to disable variables.  Handle with care."
    },
    {
        command: 'toggle',
        callback: function(pUser, pText){
            var sVal = true;
            var sOn = 'on';
            var sVar;
            if (pText == 'q' || pText == 'queue'){
                sVar = 'global.mQueueOn';
                if (global.mQueueOn) sVal = false;
            };
            if (pText == 'limit' || pText == 'songlimit'){
                sVar = 'global.mLimitOn';
                if (global.mLimitOn) sVal = false;
            };
            if (pText == 'lonely' || pText == 'lonelydj'){
                sVar = 'global.mLonelyDJ';
                if (global.mLonelyDJ) sVal = false;
            };
            if (pText == 'whitelist'){
                sVar = 'global.mWhiteListEnabled';
                if (global.mWhiteListEnabled) sVal = false;
            };
            if (pText == 'warn'){
                sVar = 'global.mWarn';
                if (global.mWarn) sVal = false;
            };
            if (!sVal) sOn = 'off';
            Speak(pUser, "Turning " + pText + " " + sOn, SpeakingLevel.Misc, null, true);
            eval(sVar + " = " + sVal);
            mParsing['{queue}'] = mQueueOn ? "on" : "off";
            mParsing['{queuecurrentlyon}'] = mQueueCurrentlyOn ? "on" : "off";
            mParsing['{songlimitcurrentlyon}'] = mSongLimitCurrentlyOn ? "on" : "off";
        },
        requires: Requires.Owner,
        hint: "Used to toggle variables. q, limit, lonelydj, whitelist, warn",
        pm: true
    },
    {
        command: 'set',
        callback: function(pUser, pText){
            if (!pText) return;
            var sSplit = pText.split(' ');
            var sVariable = sSplit.shift();
            var sValue = sSplit.join(' ');
            if (sVariable == 'greet' || sVariable == 'greeting') sVariable = 'global.mDefaultGreeting';
            if (sVariable == 'theme') sVariable = 'global.mTheme';
            if (sVariable == 'help') sVariable = 'global.mHelpMsg';
            if (sVariable == 'limit' || sVariable == 'songlimit') sVariable = 'global.mMaxSongs';
            if (sVariable == 'wait' || sVariable == 'songwait') sVariable = 'global.mWaitSongs';
            if (sVariable == 'afk' || sVariable == 'afklimit') sVariable = 'global.mAFK';
            Log("Setting " + sVariable + " to have the value of " + sValue);
            Speak(pUser, "Setting " + sVariable + " to " + sValue, SpeakingLevel.Misc, null, true);
            if (isNaN(sValue)) { eval(sVariable + ' = "' + sValue + '"'); }
            else { eval(sVariable + ' = ' + sValue); }
            mParsing['{theme}'] = mTheme;
            mParsing['{songlimit}'] = mCurrentSongLimit;
            mParsing['{afklimit}'] = mParsing['{afk}']  = mAFK;
            mParsing['{songwait}'] = mWaitSongs;
        },
        requires: Requires.Owner,
        hint: "Temporarily changes options: greet, theme, help, limit, wait, afk",
        pm: true
    },
    {
    	command: 'userid',
    	callback: function(pUser, pText){
    		if(pText)
	    		FindByName(pText, function(sUser){
	    			if(sUser && sUser.length)
	    				Speak(sUser[0], mTheirUserId, SpeakingLevel.Misc);
	    		});
    		else pUser.PM(mYourUserId, SpeakingLevel.Misc);
    	},
    	requires: Requires.User,
    	hint: "PMs the caller their userid if no args, otherwise speaks the userid of the name of the person in the args."
    },
    {
    	command: 'addwhitelist',
    	callback: function(pUser, pText){
    		if(!pText) return;
    		if(mUsers[pText.trim()]){
    			var sUser = mUsers[pText.trim()];
    			sUser.whiteList = true;
    			Speak(sUser, mAddedToWhiteList, SpeakingLevel.Misc);
    			sUser.Save();
			}else FindByName(pText, function(sUsers){ 
                for(var i = 0; i < sUsers.length; ++i){
                    var sUser = sUsers[i];
				    sUser.whiteList = true; 
				    sUser.Save(); 
				    Speak(sUser, mAddedToWhiteList, SpeakingLevel.Misc);
                }
			});
    	},
    	requires: Requires.Moderator,
    	hint: "Adds a user to the whitelist of DJs temporarily."
    },
    {
    	command: 'removewhitelist',
    	callback: function(pUser, pText){
    		if(mUsers[pText.trim()]){
    			var sUser = mUsers[pText.trim()];
    			sUser.whiteList = false;
    			if(sUser.isDJ) sUser.RemoveDJ();
    			Speak(sUser, mRemovedFromWhiteList, SpeakingLevel.Misc);
			}else FindByName(pText, function(pUsers){ 
				for(var i = 0; i < pUsers.length; ++i){
					var sUser = pUsers[i];
					sUser.whiteList = false;  
					if(sUser.isDJ) 
						sUser.RemoveDJ(); 
					sUser.Save(); 
					Speak(sUser, mRemovedFromWhiteList, SpeakingLevel.Misc);
				}
			});
    	},
    	requires: Requires.Moderator,
    	hint: "Removes a user from the whitelist of DJs temporarily."
    },
    {
        command: 'go',
        callback: function(pUser, pText) {
            if (!pText) return Speak(pUser, 'You must provide a room id.', SpeakingLevel.Misc, null, true);
            if (pText == 'home') return mBot.roomRegister(mRoomId);
            mNoGo = setTimeout(mGoHome, 15000);
            Log('Registering in room '+ pText);
            return mBot.roomRegister(pText);
        },
        requires: Requires.Owner,
        hint: "Moves the bot from room to room"
    },
    {
        command: 'hop',
        callback: function(pUser, pText) {
            if (mLonelyDJ) return Speak(pUser, "Sorry, I can't DJ with LonelyDJ enabled D:", SpeakingLevel.Misc, null, true);
            if (!mBotDJ) return Speak(pUser, "Sorry, I don't know how to DJ.", SpeakingLevel.Misc, null, true);
            if (pText == 'up' && mDJs.indexOf(mUserId) == -1) mBot.addDj();
            if (pText == 'down' && mDJs.indexOf(mUserId) != -1) mBot.remDj(mUserId);
        },
        requires: Requires.Moderator,
        hint: "Makes the bot DJ"
    },
    {
        command: 'song',
        callback: function(pUser, pText) {
            if (!pText) return;
            if (pText == 'skip' && mCurrentDJ.userid == mUserId) return mBot.stopSong();
            if (!mBotDJ) return Speak(pUser, "Sorry, I don't know how to DJ.", SpeakingLevel.Misc, null, true);
            if (pText == 'add') {
                mBot.playlistAdd(mCurrentSong.songId);
                return Speak(pUser, "Added to queue!", SpeakingLevel.Misc);
            };
            if (pText == 'remove') {
                //if(mCurrentDJ.userid != mUserId) return Speak(pUser, "You can only remove a song when I'm playing a song.", SpeakingLevel.Misc, null, true);
                mBot.playlistAll(function(pData){
                    var i = pData.list.length - 1;
                    mBot.stopSong();
                    Speak(pUser, 'Removing '+pData.list[i].metadata.song, SpeakingLevel.Misc, null, true);
                    return mBot.playlistRemove(i);
                })
            };
            if (pText == 'next') {
                mBot.playlistAll(function(pData){
                    return Speak(pUser, pData.list[0].metadata.song, SpeakingLevel.Misc, null, true)
                })
            }

        },
        requires: Requires.Moderator,
        hint: "song skip (skips song), song add (adds current song to queue), song remove (removes last played song from queue), song next (lists next song), song total (total songs in queue).",
        pm: true
    },
    {
    	command: 'refresh',
    	callback: function(pUser, pText){
    		if(!pUser.isDJ){
    			pUser.PM(mNotDJ, SpeakingLevel.Misc);
    			return;
    		}
    		if(!pUser.allowedToReserveSpot) return
    		var sTime = Date.now();
    		var sHold = {
    			userid: pUser.userid,
    			time: sTime
    		};
    		var sIndex = mReservedSpots.push(sHold) - 1;
    		
    		setTimeout(function(){
    			sIndex = mReservedSpots.indexOf(sHold);
    			if(sIndex != -1) mReservedSpots.splice(sIndex, 1);
    		}, mHoldSpotForRefreshTime * 1000);
    		pUser.PM(mReadyRefresh, SpeakingLevel.Misc);
    		pUser.RemoveDJ();
    	},
    	requires: Requires.User,
    	hint: "Lets the user refresh and the bot will hold their spot for "+mHoldSpotForRefreshTime+" minutes."
    },
    {
    	command: 'status',
    	callback: function(pUser, pText){
            Speak(pUser, 'Theme: '+global.mTheme+', AFK Limit: '+global.mAFK+', Song Limit: '+global.mMaxSongs+', Song Wait: '+global.mWaitSongs+', Queue: '+global.mQueueOn+', LonelyDJ: '+global.mLonelyDJ+'.', SpeakingLevel.Misc, null, true);
    	},
    	requires: Requires.User,
    	hint: "Shows the bot status.",
        pm: true
    }
];
