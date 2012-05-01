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
    callback: function (pUser, pText) {
        Speak(pUser, mHelpMsg, SpeakingLevel.Misc, null, true);
    },
    requires: Requires.User,
    hint: "Gives the users some pretty basic help and advice.",
    bare: true,
    pm: true
}, 
{
    command: 'crash',
    callback: function (pUser, pText) {
        throw new Error('Crashing the bot.');
    },
    requires: Requires.Owner,
    hint: "Crashes the bot. Don't do unless necessary."
}, 
{
    command: 'ban',
    callback: function (pUser, pText) {
        var sSplit = pText.split(' ');
        if(sSplit.length == 1) Ban(sSplit[0]);
        else Ban(sSplit.shift(), sSplit.join(' '));
    },
    requires: Requires.Moderator,
    hint: "Add a user to the ban list and kicks them from the room."
}, 
{
    command: 'unban',
    callback: function (pUser, pText) {
        if(pText) Unban(pText);
    },
    requires: Requires.Moderator,
    hint: "Removes a user from the ban list."
}, 
{
    command: 'say',
    callback: function (pUser, pText) {
        mBot.speak(pText);
    },
    requires: Requires.Owner,
    hint: "Makes the bot say something.",
    pm: true,
    bare: true
}, 
{
    command: 'q+',
    callback: function (pUser, pText) {
        if(!mQueueCurrentlyOn) return Speak(pUser, mQueueOff, SpeakingLevel.Misc);
        if(mDJs.indexOf(pUser.userid) != -1) {
            Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
        } else if(mQueue.indexOf(pUser.userid) != -1) {
            Speak(pUser, mAlreadyInQueue, SpeakingLevel.Misc);
        } else if(mDJs.length == mMaxDJs) {
            QueuePush(pUser.userid);
            Speak(pUser, mQueueAdded, SpeakingLevel.Misc);
        } else Speak(pUser, mOpenSpotNoQueueing, SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "Used to join the queue.",
    bare: true,
    hidden: true
}, 
{
    command: 'q-',
    callback: function (pUser, pText) {
        if(mDJs.indexOf(pUser.userid) != -1) {
            Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
        } else if(mQueue.indexOf(pUser.userid) != -1) {
            mQueue.splice(mQueue.indexOf(pUser.userid), 1);
            Speak(pUser, mRemoveFromQueue, SpeakingLevel.Misc);
        } else Speak(pUser, mNotInQueue, SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "Used to remove from the queue.",
    bare: true,
    hidden: true
}, 
{
    command: 'q',
    callback: function (pUser, pText) {
        if(!pText) {
            if(!mQueueCurrentlyOn) return Speak(pUser, mQueueOff, SpeakingLevel.Misc);
            else if(mQueue.length > 0) return Speak(pUser, mQueueUsers, SpeakingLevel.Misc);
            else return Speak(pUser, mQueueEmpty, SpeakingLevel.Misc)
        };
        var sSplit = pText.split(' ');
        var sArg = sSplit.shift();
        var sVal = sSplit.join(' ');
        if(sArg == 'remove') {
            if(sVal == 'me') {
                if(mDJs.indexOf(pUser.userid) != -1) {
                    return Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
                } else if(mQueue.indexOf(pUser.userid) != -1) {
                    mQueue.splice(mQueue.indexOf(pUser.userid), 1);
                    return Speak(pUser, mRemoveFromQueue, SpeakingLevel.Misc);
                } else return Speak(pUser, mNotInQueue, SpeakingLevel.Misc);
            }
            if(mQueue.length > 0 && (pUser.isMod)) {
                if(!sVal) {
                    var sUser = mUsers[mQueue[0]];
                    Speak(sUser, mModRemoveFromQueue, SpeakingLevel.Misc);
                    mQueue.shift();
                } else {
                    FindByName(sVal, function (sUser) {
                        for(var i = 0; i < sUser.length; ++i) {
                            if(mQueue.indexOf(sUser[i].userid) === -1) return;
                            if(sUser[i] == mUsers[mQueue[0]]) {
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
        };
        if(sArg == 'clear' && (pUser.isMod)){
            mQueue = [];
            mQueueNextUp = null;
            return Speak (pUser, 'Queue Cleared', SpeakingLevel.Misc);
        };
        if(sArg == 'status'){
            if(!mQueueCurrentlyOn) return Speak(pUser, mQueueOff, SpeakingLevel.Misc);
            else if(mQueue.length > 0) return Speak(pUser, mQueueStatus, SpeakingLevel.Misc);
            else return Speak(pUser, mQueueEmpty, SpeakingLevel.Misc)
        };
        if(sArg == 'add'){
            if(!mQueueCurrentlyOn) return Speak(pUser, mQueueOff, SpeakingLevel.Misc);
            if(mDJs.indexOf(pUser.userid) != -1) {
                return Speak(pUser, mQueueAlreadyDJ, SpeakingLevel.Misc);
            } else if(mQueue.indexOf(pUser.userid) != -1) {
                return Speak(pUser, mAlreadyInQueue, SpeakingLevel.Misc);
            } else if(mDJs.length == mMaxDJs) {
                QueuePush(pUser.userid);
                return Speak(pUser, mQueueAdded, SpeakingLevel.Misc);
            } else return Speak(pUser, mOpenSpotNoQueueing, SpeakingLevel.Misc);
        }

    },
    requires: Requires.User,
    hint: "q add, q remove, q status",
    bare: true
}, 
{
    command: 'maul',
    callback: function (pUser, pText) {
        if (!pText) return;
        FindByName(pText, function (sUser) {
            for(var i = 0; i < sUser.length; ++i)
            mBot.remDj(sUser[i].userid);
        });
    },
    requires: Requires.Moderator,
    hint: "Remove a DJ"
}, 
{
    command: 'gtfo',
    callback: function (pUser, pText) {
        FindByName(pText, function (sUser) {
            if(sUser.length > 0) sUser = sUser[0];
            mBot.bootUser(sUser.userid, "Not in my kitchen.");
        });
    },
    requires: Requires.Moderator,
    hint: "Boot a User"
}, 
{
    command: 'slap',
    callback: function (pUser, pText) {
        FindByName(pText, function (sUser) {
            if(sUser.length > 0) {
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
    callback: function (pUser, pText) {
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
    callback: function (pUser, pText) {
        mBot.bootUser(pUser.userid, "Not in my kitchen.");
    },
    requires: Requires.User,
    hint: "Remove self from room"
}, 
{
    command: 'disable',
    callback: function (pUser, pText) {
        eval(pText + " = null");
    },
    requires: Requires.Owner,
    hint: "Used to disable variables.  Handle with care."
}, 
{
    command: 'djs',
    callback: function (pUser, pText) {
        if (!pText) {
            var sDJSongCount = [];
            for(var sDJ in mDJs) {
                var sUser = mUsers[mDJs[sDJ]];
                sDJSongCount.push(sUser.name + ": " + sUser.songCount);
            }
            return Speak(pUser, mCurrentDJSongCount, SpeakingLevel.Misc, [
                ['{djsandsongcount}', sDJSongCount.join(', ')]
            ]);
        };
        var sSplit = pText.split(' ');
        var sVar = sSplit.shift();
        var sVal = sSplit.join(' ');
        if (sVar == 'wait') {
            var sDJWaitCount = [];
            for(var x in mUsers) {
                var sUser = mUsers[x];
                if (sUser.mWaitingSongLimit > 0) sDJWaitCount.push(sUser.name + ": " + sUser.mWaitingSongLimit);
            }
            return Speak(pUser, "Wait Counts: {djwaticount}", SpeakingLevel.Misc, [
                ['{djwaticount}', sDJWaitCount.join(', ')]
            ]);
        };
        if (pUser.isMod) {
            if (sVar == 'reset') {
                if (sVal == 'all') {
                    for(i in mDJs) {
                        var sUser = mUsers[mDJs[i]];
                        sUser.songCount = 0;
                    }   
                Speak(pUser, 'All DJ song counts have been reset.', SpeakingLevel.Misc);
                } else FindByName(sVal, function (sUsers) {
                    for(var i = 0; i < sUsers.length; ++i) {
                        var sUser = sUsers[i];
                        if (sUser.isDJ) {
                            sUser.songCount = 0;
                            Speak(sUser, "{username}'s song count has been reset.", SpeakingLevel.Misc);
                        };
                    }
                });    
            } else FindByName(sVar, function (sUsers) {
                    for(var i = 0; i < sUsers.length; ++i) {
                        var sUser = sUsers[i];
                        if (sUser.isDJ) {
                            sUser.songCount = sVal;
                            Speak(sUser, "{username}'s song count has been set to "+sVal, SpeakingLevel.Misc);
                        };
                    }
            });
        }
    },
    requires: Requires.User,
    hint: "Song count for the DJs. /djs, /djs reset all, /djs reset @username"
}, 
{
    command: 'afks',
    callback: function (pUser, pText) {
        var sDJAfkCount = [];
        for(var sDJ in mDJs) {
            var sUser = mUsers[mDJs[sDJ]];
            var sAfkTime = sUser.afkTime;
            var sAge = Date.now() - sAfkTime;
            var sAge_Minutes = Math.floor(sAge / 1000 / 60);
            sDJAfkCount.push(sUser.name + ": " + sAge_Minutes + 'm');
        }
        Speak(pUser, mCurrentDJAfkCount, SpeakingLevel.Misc, [
            ['{djsandafkcount}', sDJAfkCount.join(', ')]
        ]);
    },
    requires: Requires.User,
    hint: "Tells the current afk timer for the DJs."
}, 
{
    command: 'commands',
    callback: function (pUser, pText) {
        var sCommands = [];
        mCommands.forEach(function (pCommand) {
            if(pCommand.requires.check(pUser) && !(pCommand.hidden)) sCommands.push(pCommand.command);
        });
        if (mBotDJ) sCommands.push('hop, /song');
        Speak(pUser, mCommandsList, SpeakingLevel.Misc, [
            ['{commands}', sCommands.join(', /')]
        ], true);
    },
    requires: Requires.User,
    hint: "Tells what all the commands are.",
    pm: true
}, 
{
    command: 'theme',
    callback: function (pUser, pText) {
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
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : ""),
    hidden: true
}, 
{
    command: ['dance', 'bop'],
    message: 'Bust a move!',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : "")
}, 
{
    command: 'hulk',
    message: ['This is my favorite dubstep.', 'I just want to hump the speaker.'],
    callback: function (pUser, pText) {
        mBot.vote("up");
        mBot.speak(mRandomItem(this.message));
    },
    requires: Requires.Moderator,
    hint: "Makes the bot dance.  Can not be done by regular users.",
    hidden: true
}, 
{
    command: 'moo',
    callback: function (pUser, pText) {
        Speak(pUser, "I'm not a cow, but oka-MOOOOO!", SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "moo.",
    hidden: true
}, 
{
    command: 'pats',
    callback: function (pUser, pText) {
        Speak(pUser, "/me purrrrrrrrrrrrs", SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "pats.",
    hidden: true
}, 
{
    command: 'album',
    callback: function (pUser, pText) {
        Speak(pUser, "{title} is on {album}", SpeakingLevel.Misc, [['{title}', mCurrentSong.songName], ['{album}', mCurrentSong.songAlbum]])
    },
    requires: Requires.User,
    hint: "Get the album",
    hidden: true
}, 
{
    command: 'order',
    callback: function (pUser, pText) {
        HandleMenu(pUser, pText);
    },
    requires: Requires.User,
    hint: "Order something off the menu."
}, 
{
    command: 'bootaftersong',
    callback: function (pUser, pText) {
        if(pUser.isDJ) {
            pUser.bootAfterSong = true;
            pUser.PM(mPMWillBootOffDeck, SpeakingLevel.Misc);
        } else pUser.PM(mNotDJ, SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "Removes the user from the deck after their song is over."
}, 
{
    command: 'vip',
    callback: function (pUser, pText) {        
        if(!pText) return;
        var sSplit = pText.split(' ');
        var sVar = sSplit.shift();
        var sVal = sSplit.join(' ');
        if (sVar == 'add') {
            FindByName(sVal, function (sUser) {
                if(sUser.length != 1) return;
                sUser = sUser[0];
                sUser.isVip = true;
                sUser.Save();
                Speak(sUser, mIsNowVIP, SpeakingLevel.Misc);
            });
        }
        else if (sVar == 'remove'){
            FindByName(sVal, function (sUser) {
                if(sUser.length != 1) return;
                sUser = sUser[0];
                sUser.isVip = false;
                sUser.Save();
                Speak(sUser, mIsNoLongerVIP, SpeakingLevel.Misc);
            });
        }
        else if (sVar == 'list'){
            var sVips = [];
            for(var x in mUsers) {
                var sUser = mUsers[x];
                if (sUser.isVip) sVips[sUser.userid] = sUser.name;
            }

			if(mMongoDB){
	            mMongoDB.collection(mRoomShortcut).find({'isVip': true}).toArray(function(err, sArray){
	               if(sArray && sArray.length)
		               for(var i = 0; i < sArray.length; ++i){
		               		if(!sVips[sArray[i].userid]) sVips[sArray[i].userid] = sArray[i].name;
		               }
	               Speak(pUser, "VIPs: {vip_list}", SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]], true);
	            });
           }else Speak(pUser, "VIPs: {vip_list}", SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]], true);
        }else if (!sVar){ Speak(pUser, 'Useage: /vip add @[user], /vip remove @[user], /vip list', SpeakingLevel.Misc, null, true); }
    },
    requires: Requires.Moderator,
    hint: "Useage: /vip add @[user], /vip remove @[user], /vip list",
    pm: true
},  
{
    command: 'setvar',
    callback: function (pUser, pText) {
        if(!pText) return;
        var sSplit = pText.split(' ');
        var sVariable = sSplit.shift();
        var sValue = sSplit.join(' ');
        Log("Setting " + sVariable + " to have the value of " + sValue);
        eval(sVariable + ' = ' + sValue);
    },
    requires: Requires.Owner,
    hint: "Temporarily changes options",
    hidden: true
}, 
{
    command: 'disable',
    callback: function (pUser, pText) {
        eval(pText + " = null");
    },
    requires: Requires.Owner,
    hint: "Used to disable variables.  Handle with care.",
    hidden:true
}, 
{
    command: 'turn',
    callback: function (pUser, pText) {
        if(!pText) return;
        var sSplit = pText.split(' ');
        var sTxt = sSplit.shift();
        var sArg = sSplit.join(' ');
        var sVal = true;
        var sVar;
        if(sTxt == 'q' || sTxt == 'queue') {
            sVar = 'mQueueOn';
            mQueueCurrentlyOn = false;
            if(sArg == 'on') mQueueCurrentlyOn = true;
        } else if(sTxt == 'limit' || sTxt == 'songlimit') {
            sVar = 'mLimitOn';
        } else if(sTxt == 'dj') {
            sVar = 'mBotDJ';
        } else if(sTxt == 'lonely' || sTxt == 'lonelydj') {
            sVar = 'mLonelyDJ';
        } else if(sTxt == 'whitelist') {
            sVar = 'mWhiteListEnabled';
        } else if(sTxt == 'warn') {
            sVar = 'mWarn';
        } else {
            return;
        };
        if (sArg == 'off') sVal = false;
        Speak(pUser, "Turning " + sTxt + " " + sArg, SpeakingLevel.Misc, null, true);
        eval(sVar + " = " + sVal);
        mParsing['{queue}'] = mQueueOn ? "on" : "off";
        mParsing['{queuecurrentlyon}'] = mQueueCurrentlyOn ? "on" : "off";
        mParsing['{songlimitcurrentlyon}'] = mSongLimitCurrentlyOn ? "on" : "off";
    },
    requires: Requires.Moderator,
    hint: "Used to toggle variables. q, limit, lonelydj, whitelist, warn, dj",
    pm: true
}, 
{
    command: 'set',
    callback: function (pUser, pText) {
        if(!pText) return;
        var sSplit = pText.split(' ');
        var sVariable = sSplit.shift();
        var sValue = sSplit.join(' ');
        var sVar;
        if(sVariable == 'greet' || sVariable == 'greeting'){ sVar = 'mDefaultGreeting'; }
        else if(sVariable == 'theme'){ sVar = 'mTheme'; }
        else if(sVariable == 'help'){ sVar = 'mHelpMsg'; }
        else if(sVariable == 'limit' || sVariable == 'songlimit'){ sVar = 'mMaxSongs'; }
        else if(sVariable == 'wait' || sVariable == 'songwait'){ sVar = 'mWaitSongs'; }
        else if(sVariable == 'afk' || sVariable == 'afklimit'){ sVar = 'mAFK'; }
        else { return; }
        Log("Setting " + sVar + " to have the value of " + sValue);
        Speak(pUser, "Setting " + sVariable + " to " + sValue, SpeakingLevel.Misc, null, true);
        if(isNaN(sValue)) {
            eval(sVar + ' = "' + sValue + '"');
        } else {
            eval(sVar + ' = ' + sValue);
        }
        mParsing['{theme}'] = mTheme;
        mParsing['{songlimit}'] = mCurrentSongLimit;
        mParsing['{afklimit}'] = mParsing['{afk}'] = mAFK;
        mParsing['{songwait}'] = mWaitSongs;
    },
    requires: Requires.Moderator,
    hint: "Temporarily changes options: greet, theme, help, limit, wait, afk",
    pm: true
}, 
{
    command: 'userid',
    callback: function (pUser, pText) {
        if(pText) FindByName(pText, function (sUser) {
            if(sUser && sUser.length) Speak(sUser[0], mTheirUserId, SpeakingLevel.Misc);
        });
        else pUser.PM(mYourUserId, SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "PMs the caller their userid if no args, otherwise speaks the userid of the name of the person in the args."
}, 
{
    command: 'whitelist',
    callback: function (pUser, pText) {
        if(!pText) return Speak(pUser, 'Useage: /whitelist add [user], /whitelist remove [user]', SpeakingLevel.Misc, null, true);
        var sSplit = pText.split(' ');
        var sArg = sSplit.shift();
        var sVal = sSplit.join(' ');
        if(sArg == 'add') {
            if(mUsers[sVal.trim()]) {
                var sUser = mUsers[sVal.trim()];
                sUser.whiteList = true;
                Speak(sUser, mAddedToWhiteList, SpeakingLevel.Misc);
                sUser.Save();
            } else FindByName(sVal, function (sUsers) {
                for(var i = 0; i < sUsers.length; ++i) {
                    var sUser = sUsers[i];
                    sUser.whiteList = true;
                    sUser.Save();
                    Speak(sUser, mAddedToWhiteList, SpeakingLevel.Misc);
                }
            });
        };
        if(sArg == 'remove') {
            if(mUsers[sVal.trim()]) {
                var sUser = mUsers[sVal.trim()];
                sUser.whiteList = false;
                if(sUser.isDJ) sUser.RemoveDJ();
                Speak(sUser, mRemovedFromWhiteList, SpeakingLevel.Misc);
            } else FindByName(sVal, function (pUsers) {
                for(var i = 0; i < pUsers.length; ++i) {
                    var sUser = pUsers[i];
                    sUser.whiteList = false;
                    if(sUser.isDJ) sUser.RemoveDJ();
                    sUser.Save();
                    Speak(sUser, mRemovedFromWhiteList, SpeakingLevel.Misc);
                }
            });
        };
        if(sArg == 'list') {
            var sListed = [];
            for(var x in mUsers) {
                var sUser = mUsers[x];
                if (sUser.whiteList) sListed.push(sUser.name);
            }
            return Speak(pUser, "Whitelisted: {whitelisted}", SpeakingLevel.Misc, [
                ['{whitelisted}', sListed.join(', ')]
            ]);
        }
    },
    requires: Requires.Moderator,
    hint: "Add/remove a user to the whitelist of DJs temporarily."
}, 
{
    command: 'go',
    callback: function (pUser, pText) {
        if(!pText) return Speak(pUser, 'You must provide a room id.', SpeakingLevel.Misc, null, true);
        if(pText == 'home') return mBot.roomRegister(mRoomId);
        mNoGo = setTimeout(mGoHome, 15000);
        Log('Registering in room ' + pText);
        return mBot.roomRegister(pText);
    },
    requires: Requires.Owner,
    hint: "Moves the bot from room to room"
}, 
{
    command: 'hop',
    callback: function (pUser, pText) {
        if(mLonelyDJ) return Speak(pUser, "Sorry, I can't DJ with LonelyDJ enabled D:", SpeakingLevel.Misc, null, true);
        if(!mBotDJ) return Speak(pUser, "Sorry, I don't know how to DJ.", SpeakingLevel.Misc, null, true);
        if(pText == 'up' && mDJs.indexOf(mUserId) == -1) mBot.addDj();
        if(pText == 'down' && mDJs.indexOf(mUserId) != -1) mBot.remDj(mUserId);
    },
    requires: Requires.Moderator,
    hint: "Makes the bot DJ",
    pm: true,
    hidden: true
}, 
{
    command: 'song',
    callback: function (pUser, pText) {
        if(!pText) return Speak(pUser, 'Useage: /song add, /song remove, /song skip, /song next, /song total', SpeakingLevel.Misc, null, true);
        if(pText == 'skip' && mCurrentDJ.userid == mUserId) return mBot.stopSong();
        if(!mBotDJ) return Speak(pUser, "Sorry, I don't know how to DJ.", SpeakingLevel.Misc, null, true);
        if(pText == 'skip' && mCurrentDJ.userid != mUserId) {
            mBot.playlistAll(function (pData) {
                if (pData.list.length == 0) return;
                var i = pData.list.length - 1;
                Speak(pUser, "Skipped '"+ pData.list[0].metadata.song + "'. Next Song: '" + pData.list[1].metadata.song + "' Type /song requeue to undo.", SpeakingLevel.Misc, null, true)
                return mBot.playlistReorder(0, i);
            });
        };
        if(pText =='requeue'){
            mBot.playlistAll(function (pData) {
                if (pData.list.length == 0) return;
                var i = pData.list.length - 1;
                mBot.playlistReorder(i, 0);
                return Speak(pUser, "Moved "+ pData.list[i].metadata.song + ". to the top of the queue.", SpeakingLevel.Misc, null, true)
            });
        };
        if(pText == 'shuffle') {
            var sTotal = [];
            mBot.playlistAll(function (pData){
                for(var i = 0; i < pData.list.length; ++i) {
                    sTotal[i] = i;
                }
                var sRand = mShuffle(sTotal);
                for(var i = 0; i < pData.list.length; ++i) {
                    mBot.playlistReorder(i, sRand[i]);
                }
                return Speak(pUser, "Shuffled Queue.", SpeakingLevel.Misc, null, true);
            });
        };
        if(pText == 'add') {
            mBot.playlistAll(function (pData) {
                mBot.playlistAdd(mCurrentSong.songId, pData.list.length);
                return Speak(pUser, "Added " + mCurrentSong.songName + " to queue!", SpeakingLevel.Misc);
            }); 
        };
        if(pText == 'remove') {
            if(mCurrentDJ.userid != mUserId) return Speak(pUser, "You can only remove a song when I'm playing a song.", SpeakingLevel.Misc, null, true);
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                var i = pData.list.length - 1;
                mBot.stopSong();
                Speak(pUser, 'Removing ' + pData.list[i].metadata.song, SpeakingLevel.Misc, null, true);
                return mBot.playlistRemove(i);
            });
        };
        if(pText == 'next') {
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                return Speak(pUser, 'Next song: ' + pData.list[0].metadata.song + ' by ' + pData.list[0].metadata.artist, SpeakingLevel.Misc, null, true)
            });
        };
        if(pText == 'total') {
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                return Speak(pUser, 'Total Songs In My Queue: ' + pData.list.length, SpeakingLevel.Misc)
            });
        }

    },
    requires: Requires.Moderator,
    hint: "song skip (skips song), song add (adds current song to queue), song remove (removes last played song from queue), song next (lists next song), song total (total songs in queue).",
    pm: true,
    hidden: true
}, 
{
    command: 'refresh',
    callback: function (pUser, pText) {
        if(!pUser.isDJ) {
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

        setTimeout(function () {
            sIndex = mReservedSpots.indexOf(sHold);
            if(sIndex != -1) mReservedSpots.splice(sIndex, 1);
        }, mHoldSpotForRefreshTime * 1000);
        pUser.PM(mReadyRefresh, SpeakingLevel.Misc);
        pUser.RemoveDJ();
    },
    requires: Requires.User,
    hint: "Lets the user refresh and the bot will hold their spot for " + mHoldSpotForRefreshTime + " minutes."
}, 
{
    command: 'status',
    callback: function (pUser, pText) {
        var sLimit = mLimitOn;
        if (mLimitOn) sLimit = mMaxSongs;
        Speak(pUser, 'Theme: ' + mTheme + ', AFK Limit: ' + mAFK + ', Song Limit: ' + sLimit + ', Song Wait: ' + mWaitSongs + ', Queue: ' + mQueueOn + ', LonelyDJ: ' + mLonelyDJ + '.', SpeakingLevel.Misc, null, true);
    },
    requires: Requires.User,
    hint: "Shows the bot status.",
    pm: true
}, 
{
    command: 'greet',
    callback: function (pUser, pText) {
        if(!pText) return;
        var sSplit = pText.split(' ');
        var sVar = sSplit.shift();
        var sVal = sSplit.join(' ');
        if(mUsers[sVar.trim()]) {
            var sUser = mUsers[sVar.trim()];
            sUser.customGreeting = sVal;
            Speak(sUser, "{username}'s greeting set to: " + sVal, SpeakingLevel.Misc);
            sUser.Save();
        } else FindByName(sVar, function (sUsers) {
            for(var i = 0; i < sUsers.length; ++i) {
                var sUser = sUsers[i];
                sUser.customGreeting = sVal;
                sUser.Save();
                Speak(sUser, "{username}'s greeting set to: " + sVal, SpeakingLevel.Misc);
            }
        });
    }, 
    requires: Requires.Moderator,
    hint: "Set a custom greeting for a user",
    pm: true
}, 
{
    command: 'i',
    callback: function (pUser, pText) {
        if(pUser.totalSongCount < 1) return Speak(pUser, "I don't know you yet, {username}. Stay a while, play some songs.", SpeakingLevel.Misc)
        Speak(pUser, "{username}'s hearts: {heart_count}, hearts given: {given_count}, total songs: {total_songs}, Heart Percentage: {heart_percentage}%", SpeakingLevel.Misc, [
            ['{heart_count}', pUser.totalHeartCount],
            ['{given_count}', pUser.totalHeartsGiven],
            ['{total_songs}', pUser.totalSongCount],
            ['{heart_percentage}', mRound(pUser.totalHeartCount / pUser.totalSongCount * 100, 2)]
        ])
    },
    requires: Requires.User,
    hint: "All bout you"
}];