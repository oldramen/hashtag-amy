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
    hint: "Crashes the bot. Don't do unless necessary.",
    hidden: true
}, 
{
    command: 'ban',
    callback: function (pUser, pText) {
    	    if(!pText) return;
        Ban(pText, "Banned by: " + pUser.name);
    },
    requires: Requires.Moderator,
    hint: "Add a user to the ban list and kicks them from the room.",
	pm: true
}, 
{
    command: 'unban',
    callback: function (pUser, pText) {
    		if(!pText) return;
        if(pText) Unban(pText);
    },
    requires: Requires.Moderator,
    hint: "Removes a user from the ban list.",
	pm: true
}, 
{
    command: 'say',
    callback: function (pUser, pText) {
    		if(!pText) return;
        mBot.speak(pText);
    },
    requires: Requires.Owner,
    hint: "Makes the bot say something.",
    pm: true,
    bare: true
}, 
/*
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
            return Speak (pUser, mClearQueue, SpeakingLevel.Misc);
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
    hint: "/q add, /q remove, /q status, /q clear",
    bare: true
}, 
*/
{
    command: 'maul',
    callback: function (pUser, pText) {
        if (!pText) return;
        if(pText.search("//") > 0) {
        	var sSplit = pText.split("//");
        	var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
      	}
      	else {
      		var sSplit = pText.split(' ');
      		var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
 				}
        FindByName(sVar, function (sUser) {
            for(var i = 0; i < sUser.length; ++i) {
            	mBot.remDj(sUser[i].userid);
           	}
            if(sUser.length > 0) { 
            	sUser = sUser[0];
            	Speak(sUser, sVal, SpeakingLevel.Misc);
            }
        });
    },
    requires: Requires.Moderator,
    hint: "Remove a DJ",
    pm: true
},
{
    command: 'goodbye',
    callback: function (pUser, pText) {
        if (!pText) return;
        if(pText.search("//") > 0) {
        	var sSplit = pText.split("//");
        	var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
      	}
      	else {
      		var sSplit = pText.split(' ');
      		var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
 				}
 				FindByName(sVar, function (sUser) {
            if(sUser.length > 0) { 
            	sUser = sUser[0];
            	mBot.bootUser(sUser.userid, sVal);
            	Speak(sUser, sVal, SpeakingLevel.Misc);
            } 
        });
    },
    requires: Requires.Moderator,
    hint: "Remove a DJ",
    hidden: true,
    pm: true
},
{
    command: 'hook',
    callback: function (pUser, pText) {
        if (!pText) return;
        FindByName(pText, function (sUser) {
            for(var i = 0; i < sUser.length; ++i)
            	mBot.remDj(sUser[i].userid);
        });           	
    },
    requires: Requires.Moderator,
    hint: "Give a DJ the hook"
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
                Speak(sUser, '/me slaps {username}, on the ass.', SpeakingLevel.Misc);
            }
        });
    },
    requires: Requires.Moderator,
    hint: "Slap a ho",
    pm: true
}, 
{
    command: 'smack',
    callback: function (pUser, pText) {
        FindByName(pText, function (sUser) {
            if(sUser.length > 0) {
                sUser = sUser[0];
                Speak(sUser, '/me smacks {username}, in the FACE!', SpeakingLevel.Misc);
            }
        });
    },
    requires: Requires.Moderator,
    hint: "Smack a ho",
    pm: true
}, 
{
    command: 'stagedive',
    message: [
        "{username} is surfing the crowd!", 
        "Oops! {username} lost a shoe sufing the crowd.", 
        "Wooo! {username}'s surfin' the crowd! Now to figure out where the wheelchair came from...", 
        "Well, {username} is surfing the crowd, but where did they get a raft...", 
        "{username} dived off the stage...too bad no one in the audience caught them.", 
        "{username} tried to jump off the stage, but kicked their laptop. Ouch.", 
        "{username} said they were going to do a stagedive, but they just walked off.", 
        "And {username} is surfing the crowd! But why are they shirtless?", 
        "{username} just traumatized us all by squashing that poor kid up front."
    ],
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
    command: ['likeaboss','boss'],
    message: [
        "Talk to corporate, Like a boss!",
				"Approve memos, Like a boss!",
				"Read a workshop, Like a boss!",
				"Remember birthdays, Like a boss!",
				"Direct work-flow, Like a boss!",
				"My own bathroom, Like a boss!",
				"Micro-manage, Like a boss!",
				"Promote synergy, Like a boss!",
				"Hit on Deborah, Like a boss!",
				"Get rejected, Like a boss!",
				"Swallow sadness, Like a boss!",
				"Send some faxes, Like a boss!",
				"Call a sex line, Like a boss!",
				"Cry deeply, Like a boss!",
				"Demand a refund, Like a boss!",
				"Eat a bagel, Like a boss!",
				"Harassment Lawsuit, Like a boss!",
				"No Promotion, Like a boss!",
				"5th of vodka, Like a boss!",
				"Shit on Deborah's desk, Like a boss!",
				"Buy a gun, Like a boss!",
				"In my mouth, Like a boss!",
				"Oh fuck man, I can't fucking do it, shit!",
				"Pussy out, Like a boss!",
				"Puke on Deborah's desk, Like a boss!",
				"Jump out the windows, Like a boss!",
				"Suck a dude's dick, Like a boss!",
				"Score some coke, Like a boss!",
				"Crash my car, Like a boss!",
				"Suck my own dick, Like a boss!",
				"Eat some chicken strips, Like a boss!",
				"Chop my balls off, Like a boss!",
				"Black out in the sewer, Like a boss!",
				"Meet a giant fish, Like a boss!",
				"Fuck his brains out, Like a boss!",
				"Turn into a jet, Like a boss!",
				"Bomb the Russians, Like a boss!",
				"Crash into the Sun, Like a boss!",
				"Now I'm dead, Like a boss!"
    ],
    callback: function (pUser, pText) {
        var sMessage = mRandomItem(this.message);
        Speak(pUser, sMessage, SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "Quotes from Like a Boss"
}, 
{
    command: ['mybandname','bandname'],
    callback: function (pUser, pText) {
        var sMessage = mRandomItem(mBandFirstNames);
        var sMessage = sMessage +" "+mRandomItem(mBandLastNames);
        Speak(pUser, pUser.name +"'s Band Name is: :imp: " + sMessage + " :imp:", SpeakingLevel.Misc);
    },
    requires: Requires.User,
    hint: "Band name generator"
},
{
    command: 'ragequit',
    callback: function (pUser, pText) {
        mBot.bootUser(pUser.userid, "LOL, they mad.");
    },
    requires: Requires.User,
    hint: "Remove self from room"
},
{
    command: 'tantrum',
    callback: function (pUser, pText) {
        mBot.bootUser(pUser.userid, "Awww, baby wants a baba.");
    },
    requires: Requires.User,
    hint: "Remove self from room",
    hidden: true
}, 
{
    command: 'rickroll',
    callback: function (pUser, pText) {
        mBot.bootUser(pUser.userid, "Never gunna give you up, never gunna let you down!");
    },
    requires: Requires.User,
    hint: "Remove self from room",
    hidden: true
},
{
    command: 'disable',
    callback: function (pUser, pText) {
    		if(!pText) return;
        eval(pText + " = null");
    },
    requires: Requires.Owner,
    hint: "Used to disable variables.  Handle with care.",
    hidden: true
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
            if(sAge_Minutes > 10) {
            	var num1 = Math.floor(Math.random() * 10) + 1;
                var num2 = Math.floor(Math.random() * 10) + 1;
                sDJAfkCount.push("[ @" + sUser.name + ": " + sAge_Minutes + ": Math time, what does "+num1+" + "+num2+" = ? ]");
            }
            else {
            	sDJAfkCount.push("[ "+sUser.name + ": " + sAge_Minutes + " ]");
          	}
        }
        Speak(pUser, mCurrentDJAfkCount, SpeakingLevel.Misc, [
            ['{djsandafkcount}', sDJAfkCount.join(' - ')]
        ]);
    },
    requires: Requires.User,
    hint: "Tells the current afk timer for the DJs.",
    pm: true
}, 
{
    command: ['saydjs','holla','shout'],
    callback: function (pUser, pText) {
        var sDJmsg = [];
		for(var sDJ in mDJs) {
            var sUser = mUsers[mDJs[sDJ]];
            sDJmsg.push("@" + sUser.name);
        }
		var sDJlast;
		if(sDJ > 0) { 
			sDJlast = sDJmsg.pop(); // pop off last DJ in list so we can stick "and" in there
			console.log("MESSAGE: " + sDJmsg.join(', ') + ' and ' + sDJlast + ': ' + pText);
			Speak(pUser, sDJmsg.join(', ') + ' and ' + sDJlast + ' - ' + pUser.name + ' says: ' + pText, SpeakingLevel.Misc);
		}
		else {
			console.log("MESSAGE: " + sDJmsg.join(', ') + ': ' + pText);
			Speak(pUser, sDJmsg.join(', ') + ' - ' + pUser.name + ' says: ' + pText, SpeakingLevel.Misc);
		}
    },
    requires: Requires.Moderator,
    hint: "Sends an @ message to all DJs on deck",
    pm: true,
	hidden: true
}, 
{
    command: 'nuke',
    callback: function (pUser, pText) {
        for(var sDJ in mDJs) {
            mBot.bootUser(mDJs[sDJ], "The deck just got nuked... ")
        }
    },
    requires: Requires.Moderator,
    hint: "Nukes the deck",
    pm: true,
	hidden: true
}, 
{
    command: 'musicalchairs',
    callback: function (pUser, pText) {
        Speak(pUser, ":musical_note: MUSICAL CHAIRS TIME! QUICK, SCRAMBLE TO GET ON DECK! :musical_note:", SpeakingLevel.Misc);
        for(var sDJ in mDJs) {
            mBot.remDj(mDJs[sDJ]);
        }
    },
    requires: Requires.Owner,
    hint: "Musical Chairs Game :)",
    pm: true,
    hidden: true
}, 
{
    command: 'commands',
    callback: function (pUser, pText) {
        var sCommands = [];
        mCommands.forEach(function (pCommand) {
            if(pCommand.command == 'spin' && mLottoOn) sCommands.push(pCommand.command);
            if(pCommand.command == 'song' && mBotDJ) sCommands.push(pCommand.command);
            if(pCommand.requires.check(pUser) && !(pCommand.hidden)) sCommands.push(pCommand.command);
        });
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
    message: 'Gimme two shots and clear the dance floor!!',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : ""),
    hidden: true
}, 
{
    command: 'slam',
    message: '*SLAMS* :beer: on ground in MOSH PIT... slip and bleed from the anus :rage3:!!!',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: Requires.Moderator,
    hint: "Makes the bot slam dance. Can not be done by regular users.",
    hidden: true
},
{
    command: 'explode',
    message: ':speaker: Speakers EXPLODE sending shrapnel into the crowd! :skull: BOOOM!!! EAT IT! :speaker:',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: Requires.Moderator,
    hint: "Makes the speakers explode. Can not be done by regular users.",
    hidden: true
},
{
    command: 'awexome',
    callback: function (pUser, pText) {
        mBot.vote("up");
    },
    requires: Requires.User,
    hint: "Makes the bot awexome remotely from Chatty.",
    hidden: true,
    pm: true
},
{
    command: ['lame','naw','srsly'],
    callback: function (pUser, pText) {
        mBot.vote("down");
    },
    requires: Requires.Moderator,
    //hint: "Fuck Skrillex, usage: /fs @username",
    hint: "make the bot lame a song",
    hidden: true
},
{
    command: ['dance', 'bop', 'wub', 'bass', 'rock', 'bounce'],
    message: [
        'Knock your brain around!',
        'Get up and dance mothers to be!',
        'Move to the beat, dance with your feet!', 
        'Get your head movin\' to the beat!',
        'Dis beat is sick man, I\'m throwing up here inside!'
    ],
    callback: function (pUser, pText) {
        mBot.vote("up");
        mBot.speak(mRandomItem(this.message));
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : "")
},
{
    command: ['hard', 'boom', 'jump'],
    message: [
        'This beat is kicking the shit right out of me!',
        'I feel like punching babies.. IN THE FACE!!!',
        'BOOM.. BOOM.. BOOM.. BOOM.. BOOM.. BOOM..', 
        'POGO!!!!! JUMP JUMP JUMP JUMP!!!!'
    ],
    callback: function (pUser, pText) {
        mBot.vote("up");
        mBot.speak(mRandomItem(this.message));
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : ""),
    hidden: true
},
{
    command: ['derp','herp'],
    callback: function (pUser, pText) {
        mBot.speak(":white_square::black_square::black_square::white_square::white_square::white_square::white_square::black_square::black_square:");
        setTimeout(function () { 
        	mBot.speak(":black_square::white_square::white_square::black_square::white_square::white_square::black_square::white_square::black_square::black_square:");
        }, 150);
        setTimeout(function () { 
        	mBot.speak(":black_square::black_square::white_square::black_square::white_square::white_square::black_square::white_square::black_square::black_square:");
        }, 300);
        setTimeout(function () { 
        	mBot.speak(":black_square::black_square::white_square::black_square::white_square::white_square::black_square::white_square::white_square::black_square:");
        }, 450);
        setTimeout(function () { 
        	mBot.speak(":white_square::black_square::black_square::white_square::white_square::white_square::white_square::black_square::black_square:");
        }, 600);	
    },
    requires: Requires.Owner,
    hint: "Makes the bot DERP",
    hidden: true
},

{
    command: ['stripper'],
    callback: function (pUser, pText) {
        if(!pText) {
        	mBot.speak("Hmm... What kind of stripper do you want? /stripper ____?");
        	return;
        }
        var sSplit = pText.split(' ');
        var sTxt = sSplit.shift();
        var sArg = sSplit.shift(); //For now, store this... maybe use later
        if(sTxt == 'm' || sTxt == 'male' || sTxt == 'guy' || sTxt == 'man') {
            mBot.speak("* A police officer :cop: knocks on the door * ");
        		setTimeout(function () { 
        			mBot.speak(":musical_note: It's Raining Men :musical_note: starts to play out of no where!");
        		}, 4000);
		        setTimeout(function () { 
    		    	mBot.speak("* Stripping off layer :person_with_blond_hair: by layer :necktie: he's slapping you in the face with his :eggplant: now *");
        		}, 8000);
        		setTimeout(function () { 
        			mBot.speak(":heart_eyes: Lucky you :blue_heart:");
        		}, 12000);
        }
    	else if(sTxt == 'f' || sTxt == 'female' || sTxt == 'girl' || sTxt == 'woman') {
           	mBot.speak("* A nurse :woman: with a :syringe: knocks on the door * ");
        		setTimeout(function () { 
        			mBot.speak(":musical_note: Apple bottom jeans, Boots with the fur :musical_note: starts to play out of no where!");
        		}, 4000);
		        setTimeout(function () { 
    		    	mBot.speak("* Stipping off layer :bikini: by layer :high_heel: she's :kiss: you all over now *");
        	  }, 8000);
        	  setTimeout(function () { 
        			mBot.speak(":heart_eyes: Lucky you :heartpulse:");
        		}, 12000);    
        }
        
    },
    requires: Requires.Owner,
    hint: "Makes the bot dance",
    hidden: true
},
{
    command: ['slut','s3rl'],
    message: [
        '/me I\'m a hard bass slut!',
        'I <3 s3rl'
    ],
    callback: function (pUser, pText) {
        mBot.vote("up");
        mBot.speak(mRandomItem(this.message));
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : ""),
    hidden: true
},
{
    command: ['wallet'],
    callback: function (pUser, pText) {
        FindByName(pText, function (sUser) {
            if(sUser.length > 0) {
                sUser = sUser[0];
                Speak(pUser, '@{username}, you currently have $'+ (Math.floor(Math.random() * 950000) + 50000) + ' in your wallet.', SpeakingLevel.Misc);
            }
        });
    },
    requires: Requires.User,
    hint: "Spits out what's in YOUR wallet."
},
{
    command: ['schlong'],
    callback: function (pUser, pText) {
        FindByName(pText, function (sUser) {
            if(sUser.length > 0) {
                sUser = sUser[0];
                var sDSize = Math.floor(Math.random() * 30) + 1;
                var sDInches = (sDSize / 2.5) + 1;
                sDInches = sDInches.toFixed(1);
                var sShaft = "=";
                while(sDSize) {
                	sShaft += '=';
                	sDSize--;
                }
                Speak(pUser, '@{username}\'s schlong is 8' + sShaft + 'D ' + sDInches + " Inches!", SpeakingLevel.Misc);
            }
        });
    },
    requires: Requires.User,
    hint: "Spits out the size of your Schlong."
},
{
    command: ['smooth', 'sleepy'],
    message: 'smooth groove is puttin\' me to sleep :zzz:',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: mModBop ? Requires.Moderator : Requires.User,
    hint: "Makes the bot dance." + (mModBop ? "  Can not be done by regular users." : "")
},
{
    command: ['mainstream', 'overplayed'],
    message: 'Good grief Charlie Brown how many times a day are we going to hear this:question:',
    callback: function (pUser, pText) {
        mBot.vote("up");
        Speak(pUser, this.message, SpeakingLevel.Misc);
    },
    requires: Requires.Moderator,
    hint: "Makes the bot complain. Can not be done by regular users."
}, 
{
    command: 'hulk',
    message: [
        'This is my favorite dubstep.',
        'I\'m so in <3 with this song right now!',
        'If this song and I could only make babies...', 
        'I just want to dry hump the speaker.'
    ],
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
    command: ['pats','pets'],
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
        Speak(pUser, mAlbum, SpeakingLevel.Misc, [['{title}', mCurrentSong.songName], ['{album}', mCurrentSong.songAlbum]])
    },
    requires: Requires.User,
    hint: "Get the album",
    hidden: true
}, 
{
    command: 'order',
    callback: function (pUser, pText) {
    		if(!pText) return;
        HandleMenu(pUser, pText);
    },
    requires: Requires.User,
    hint: "Order something off the menu."
}, 
{
    command: ['bootaftersong','pressplaywalkaway'],
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
            var sVips = {};
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
	               console.log(sVips);
	               Speak(pUser, mVIPList, SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]], true);
	            });
           }else Speak(pUser, mVIPList, SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]], true);
        }else if (!sVar){ Speak(pUser, 'Useage: /vip add @[user], /vip remove @[user], /vip list', SpeakingLevel.Misc, null, true); }
    },
    requires: Requires.Moderator,
    hint: "Useage: /vip add @[user], /vip remove @[user], /vip list",
    pm: true,
    hidden: true
},
{
    command: 'vips',
    callback: function (pUser, pText) {
        var sVips = {};
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
                   console.log(sVips);
                   Speak(pUser, mVIPList, SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]]);
                });
           }else Speak(pUser, mVIPList, SpeakingLevel.Misc, [['{vip_list}', _.values(sVips).join(', ')]]);
    },
    requires: Requires.User,
    hint: 'spits out a list of vips',
    hidden: true
},
{
    command: 'banlist',
    callback: function (pUser, pText) {
        var sBans = {};
            for(var x in mUsers) {
                var sUser = mUsers[x];
                if (sUser.isBanned) sBans[sUser.userid] = sUser.name;
            }

            if(mMongoDB){
                mMongoDB.collection(mRoomShortcut).find({'isBanned': true}).toArray(function(err, sArray){
                   if(sArray && sArray.length)
                       for(var i = 0; i < sArray.length; ++i){
                            if(!sBans[sArray[i].userid]) sBans[sArray[i].userid] = sArray[i].name;
                       }
                   console.log(sBans);
                   pUser.PM(mBANList, SpeakingLevel.Misc, [['{ban_list}', _.values(sBans).join(', ')]]);
                });
           }else pUser.PM(mBANList, SpeakingLevel.Misc, [['{ban_list}', _.values(sBans).join(', ')]]);
    },
    requires: Requires.Moderator,
    hint: 'spits out a list of banned users',
    hidden: true,
    pm: true
}, 
{
    command: 'search',
    callback: function (pUser, pText) {
        var sBans = {};
        var regExName = new RegExp(pText, "i");
        //console.log(regExName);
            for(var x in mUsers) {
                var sUser = mUsers[x];
                //console.log("sUser: "+sUser);
                var sTemp = sUser.name;
                //console.log("sTemp: "+sTemp);
                if (sTemp) {
                    //console.log(sUser.name + " " + sTemp.search(regExName));
                    if(sTemp.search(regExName) >= 0) {
                        sBans[sUser.userid] = sTemp;
                        //console.log(sUser.name + " === " + sTemp.search(regExName));
                    }
                }                    
            }

            if(mMongoDB){
                mMongoDB.collection(mRoomShortcut).find({'name': pText}).toArray(function(err, sArray){
                    if(sArray && sArray.length) {
                        for(var i = 0; i < sArray.length; ++i){
                            if(!sBans[sArray[i].userid]) sBans[sArray[i].userid] = sArray[i].name + 
                                " \""+sArray[i].userid+"\" " + (sArray[i].isBanned ? "is Banned":"is not Banned");
                        }
                    }
                    pUser.PM(mBANList, SpeakingLevel.Misc, [['{ban_list}', _.values(sBans).join(', ')]]);
                });
           }else pUser.PM(mBANList, SpeakingLevel.Misc, [['{ban_list}', _.values(sBans).join(', ')]]);
    },
    requires: Requires.Moderator,
    hint: 'user search',
    hidden: true,
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
    		if(!pText) return;
        eval(pText + " = null");
    },
    requires: Requires.Owner,
    hint: "Used to disable variables.  Handle with care.",
    hidden:true
}, 
{
    command: 'turn',
    callback: function (pUser, pText) {
        if(!pText) return; // Kick out if no parameters
        var sSplit = pText.split(' ');
        var sTxt = sSplit.shift();
        var sArg = sSplit.join(' ');
        if(!sArg) return; // Kick out if arg is missing
        var sVal = true;
        var sVar;
        if(sTxt == 'q' || sTxt == 'queue') {
        		sVar = 'mQueueOn';
          	if(sArg == 'on') { mQueueCurrentlyOn = true; sVal = true;} 
            else if(sArg == 'off') { mQueueCurrentlyOn = false; sVal = false;}
           	else return; // Be more explicit, we are looking for 'off' or 'on' only
            if (mLottoOn) return Speak(pUser, mNoQueueWithLotto, SpeakingLevel.Misc, null, true);          
        }
        else if(sTxt == 'billyidle' || sTxt == 'AntiIdleDetection'){
            sVar = 'mAntiIdleDetection';
            if(sArg == 'on') { mAntiIdleDetection = true; sVal = true;} 
            else if(sArg == 'off') { mAntiIdleDetection = false; sVal = false;}
            else return; // Be more explicit, we are looking for 'off' or 'on' only
        }
        else if(sTxt == 'limit' || sTxt == 'songlimit') { sVar = 'mLimitOn'; }
        else if(sTxt == 'dj') { sVar = 'mBotDJ'; }
        else if(sTxt == 'lonely' || sTxt == 'lonelydj') { sVar = 'mLonelyDJ'; }
        else if(sTxt == 'whitelist') { sVar = 'mWhiteListEnabled'; }
        else if(sTxt == 'warn') { sVar = 'mWarn'; }
        else if(sTxt == 'lotto') {
            if (mQueueCurrentlyOn) return Speak(pUser, mNoLottoWithQueue, SpeakingLevel.Misc, null, true);
            sVar = 'mLottoOn';
        }
        else { return; };
        if (sArg == 'off') sVal = false;
        Speak(pUser, "Turning " + sTxt + ": " + sArg, SpeakingLevel.Misc, null, true);
        eval(sVar + " = " + sVal);
        mParsing['{queue}'] = mQueueOn ? "on" : "off";
        mParsing['{queuecurrentlyon}'] = mQueueCurrentlyOn ? "on" : "off";
        mParsing['{songlimitcurrentlyon}'] = mSongLimitCurrentlyOn ? "on" : "off";
    },
    requires: Requires.Owner,
    hint: "Used to toggle variables. q, limit, lonelydj, whitelist, warn, dj",
    pm: true,
    hidden: true
}, 
{
    command: 'set',
    callback: function (pUser, pText) {
        if(!pText) return;  // Kick out if no parameters
        var sSplit = pText.split(' ');
        var sVariable = sSplit.shift();
        var sValue = sSplit.join(' ');
        if(!sValue) return;  // Kick out if arg is missing
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
        mCurrentSongLimit = mMaxSongs;
        mParsing['{theme}'] = mTheme;
        mParsing['{songlimit}'] = mCurrentSongLimit;
        mParsing['{afklimit}'] = mParsing['{afk}'] = mAFK;
        mParsing['{songwait}'] = mWaitSongs;
    },
    requires: Requires.Owner,
    hint: "Temporarily changes options: greet, theme, help, limit, wait, afk, AntiIdleDetection",
    pm: true,
    hidden: true
},
{
    command: 'spin',
    callback: function (pUser, pText) {
        if (!mLottoOn) return Speak(pUser, mNoLotto, SpeakingLevel.Misc, null, true);
        if (!mTimeForSpin) return Speak(pUser, mNotLottoTime, SpeakingLevel.Misc, null, true);
        if (mLottoHolders.indexOf(pUser.userid) != -1) return Speak(pUser, mCantLottoTwice, SpeakingLevel.Misc, null, true);
        mLottoHolders.push(pUser.userid);
        return Speak(pUser, mLottoThanks, SpeakingLevel.Misc, null, true);
    },
    requires: Requires.User,
    hint: 'spin for a chance to DJ next!',
    hidden: true
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
    hint: "PMs the caller their userid if no args, otherwise speaks the userid of the name of the person in the args.",
    hidden: true
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
            return Speak(pUser, mWhiteListed, SpeakingLevel.Misc, [
                ['{whitelisted}', sListed.join(', ')]
            ]);
        }
    },
    requires: Requires.Moderator,
    hint: "Add/remove a user to the whitelist of DJs temporarily.",
    hidden: true
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
        if(mLonelyDJ) return Speak(pUser, mLonelyStillOn, SpeakingLevel.Misc, null, true);
        if(!mBotDJ) return Speak(pUser, mBotDJTurnedOff, SpeakingLevel.Misc, null, true);
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
        if(!pText) return Speak(pUser, this.hint, SpeakingLevel.Misc, null, true);
        if(pText == 'skip' && mCurrentDJ.userid == mUserId) return mBot.stopSong();
        if(!mBotDJ) return Speak(pUser, mBotDJTurnedOff, SpeakingLevel.Misc, null, true);
        if(pText == 'skip' && mCurrentDJ.userid != mUserId) {
            mBot.playlistAll(function (pData) {
                if (pData.list.length == 0) return;
                var i = pData.list.length - 1;
                Speak(pUser, mSongSkip, SpeakingLevel.Misc, [['{skippedsong}', pData.list[0].metadata.song], ['{nextsong}', pData.list[1].metadata.song]], true)
                return mBot.playlistReorder(0, i);
            });
        };
        if(pText =='requeue'){
            mBot.playlistAll(function (pData) {
                if (pData.list.length == 0) return;
                var i = pData.list.length - 1;
                mBot.playlistReorder(i, 0);
                return Speak(pUser, mSongRequeue, SpeakingLevel.Misc, [['{bottomsong}', pData.list[i].metadata.song]], true)
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
                return Speak(pUser, mSongSuffle, SpeakingLevel.Misc, null, true);
            });
        };
        if(pText == 'add') {
            mBot.playlistAll(function (pData) {
                mBot.playlistAdd(mCurrentSong.songId, pData.list.length);
                return Speak(pUser, mSongAdd, SpeakingLevel.Misc, [['{currentsong}', mCurrentSong.songName]]);
            }); 
        };
        if(pText == 'remove') {
            if(mCurrentDJ.userid != mUserId) return Speak(pUser, mSongRemoveNotDJ, SpeakingLevel.Misc, null, true);
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                var i = pData.list.length - 1;
                mBot.stopSong();
                Speak(pUser, mSongRemove, SpeakingLevel.Misc, [['{lastsong}', pData.list[i].metadata.song]], true);
                return mBot.playlistRemove(i);
            });
        };
        if(pText == 'next') {
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                return Speak(pUser, mSongNext, SpeakingLevel.Misc, [['{next}', pData.list[0].metadata.song], ['{artist}', pData.list[0].metadata.artist]], true)
            });
        };
        if(pText == 'total') {
            mBot.playlistAll(function (pData) {
                if(pData.list.length == 0) return;
                return Speak(pUser, mSongTotal, SpeakingLevel.Misc, [['{songtotal}', pData.list.length]], true);
            });
        };
        var sSplit = pText.split(' ');
        var sVar = sSplit.shift();
        var sVal = sSplit.join(' ');
        if(sVar == 'search') {
            if(!sVal) return;
            var sResults = [];
            mBot.playlistAll(function (pData) {
                for(var i = 0; i < pData.list.length; ++i){
                    var sSearch = sVal.toLowerCase();
                    var sSong = pData.list[i].metadata.song.toLowerCase();
                    var sArtist = pData.list[i].metadata.artist.toLowerCase();
                    if ((sSong.indexOf(sSearch) != -1) || (sArtist.indexOf(sSearch) != -1)) sResults.push(i + ": " + sSong + " by " + sArtist);
                }
            });
            if(sResults.length < 1) return Speak(pUser, mSongSearchEmpty, SpeakingLevel.Misc, [['{query}', sVal]], true);
            if(sResults.length > 5) Speak(pUser, mSongSearchLong, SpeakingLevel.Misc, [['{numsongs}', sResults.length]], true);
            for(var i = 0; i < 4; ++i){
                Speak(pUser, sResults[i], SpeakingLevel.Misc, null, true);
            };
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
        if(!pUser.allowedToReserveSpot) return;
        var sTime = Date.now();
        var sHold = {
            userid: pUser.userid,
            time: sTime
        };
        var sIndex = mReservedSpots.push(sHold) - 1;

        setTimeout(function () {
            sIndex = mReservedSpots.indexOf(sHold);
            if(sIndex != -1) mReservedSpots.splice(sIndex, 1);
            if(mQueueCurrentlyOn && mReservedSpots.length < 1) QueueAdvance();
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
        if(pText.search("//") > 0) {
        	var sSplit = pText.split("//");
        	var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
      	}
      	else {
      		var sSplit = pText.split(' ');
      		var sVar = sSplit.shift();
        	var sVal = sSplit.join(' ');
 		}
 		if(mUsers[sVar.trim()]) {
            var sUser = mUsers[sVar.trim()];
            console.log("GREET: "+sUser.customGreeting);
            sUser.customGreeting = sVal;
            Speak(sUser, mGreetChange, SpeakingLevel.Misc, [['{greeting}', sVal]]);
            sUser.Save();
        } else FindByName(sVar, function (sUsers) {
            for(var i = 0; i < sUsers.length; ++i) {
                var sUser = sUsers[i];
                console.log("GREET: "+sUser.customGreeting);
                sUser.customGreeting = sVal;
                sUser.Save();
                Speak(sUser, mGreetChange, SpeakingLevel.Misc, [['{greeting}', sVal]]);
            }
        });
    }, 
    requires: Requires.Moderator,
    hint: "Set a custom greeting for a user",
    pm: true
},
{
    command: 'tweet',
    callback: function (pUser, pText) {
        if (!mTwitOn) return;
        var sAge = Date.now() - mLastTweeted;
        var sAge_Minutes = sAge / 60000; 
        if(sAge_Minutes < mTwitTimeout) return Speak(pUser, mTweetSpam, SpeakingLevel.Misc, [['{twitime}', mTwitTimeout]], true);
        if (!pText) {
            if (!mCurrentDJ) return;
            var sTweet = mDefaultTweet.replace(/\{currentdj\}/gi, mCurrentDJ.name).replace(/\{song\}/gi, mCurrentSong.songName);
            mTwitter.post('statuses/update', {
             status: sTweet 
            }, function(err, reply) {});
            mLastTweeted = Date.now();
            return Speak(pUser, mConfirmTweet, SpeakingLevel.Misc);
        }
        else {
            var sLen = pText.length;
            if (sLen > 140) {
                return Speak(pUser, mTweetLimit, SpeakingLevel.Misc,[['{charlimit}', 140 - sLen]], true);
            }
            mTwitter.post('statuses/update', {
             status: pText 
            }, function(err, reply) {});
            mLastTweeted = Date.now();
            return Speak(pUser, mConfirmTweet, SpeakingLevel.Misc);
        }
    },
    requires: mModTwit ? Requires.Moderator : Requires.Owner,
    hint: "'/tweet' tweets now playing, and '/tweet msg' will tweet 'msg'",
    pm: true,
    hidden: true
},
{
    command: 'lookup',
    callback: function(pUser, pText) {
        if (!mUseLastfm) return Speak(pUser, mNoLastfm, SpeakingLevel.Misc, null, true);
        if (!pText) return Speak(pUser, mLastfmNoArgs, SpeakingLevel.Misc, null, true);
        if (pText == 'genre') {
            mLastfm.request("track.getInfo", {
                track: mCurrentSong.songName,
                artist: mCurrentSong.songArtist,
                handlers: {
                    success: function(pData) {
                        return Speak(pUser, mLastfmGenre, SpeakingLevel.Misc, [['{lastfmgenre}', pData.track.toptags.tag[0].name]], true);
                    },
                    error: function(pErr) {
                        Log("Lookup Failed: "+ pErr.message);
                        if (mCurrentSong.songGenre) return Speak(pUser, mLastfmGenre, SpeakingLevel.Misc, [['{lastfmgenre}', mCurrentSong.songGenre]], true);
                        return Speak(pUser, mNoInfoLastfm, SpeakingLevel.Misc, null, true);
                    }
                }
            });
        };
        if (pText == 'artist') {
            mLastfm.request("artist.getInfo", {
                artist: mCurrentSong.songArtist,
                handlers: {
                    success: function(pData) {
                        var sBio = mStripTags(pData.artist.bio.summary);
                        Speak(pUser, sBio, SpeakingLevel.Misc, null, true);
                    },
                    error: function(pErr) {
                        Log("Lookup Failed: "+ pErr.message);
                        return Speak(pUser, mNoInfoLastfm, SpeakingLevel.Misc, null, true);
                    }
                }
            });
        };
    },
    requires: Requires.User,
    hint: "Gathers info from lastfm",
    hidden: true,
    pm: true
},
{
    command: 'i',
    callback: function (pUser, pText) {
        if(pUser.totalSongCount < 1) return Speak(pUser, "I don't know you yet, {username}. Stay a while, play some songs.", SpeakingLevel.Misc)
        Speak(pUser, mUserInfo, SpeakingLevel.Misc, [
            ['{heart_count}', pUser.totalHeartCount],
            ['{given_count}', pUser.totalHeartsGiven],
            ['{total_songs}', pUser.totalSongCount],
            ['{heart_percentage}', mRound(pUser.totalHeartCount / pUser.totalSongCount * 100, 2)]
        ])
    },
    requires: Requires.User,
    hint: "All bout you"
}];