/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 * @note All commands must be entirely lower case.
 */

global.mCommands = [
    { 
        command: 'help',
        callback: function(pUser, pText){
            if (mPMSpeak) PM(pUser, mHelpMsg, SpeakingLevel.Misc);
            else Speak(pUser, mHelpMsg, SpeakingLevel.Misc);
        }, 
        requires: Requires.User,
        hint: "Gives the users some pretty basic help and advice.",
        bare: true,
        pm: true
    },
    {
        command: 'refresh',
        callback: function(pUser, pText){
            Speak(pUser, "TODO", SpeakingLevel.Misc);
            /// Reload the variable + its coresponding collection.
        }, 
        requires: Requires.Owner, 
        hint: "Reloads the variable + its corresponding collection."
    },
    {
        command: 'ban',
        callback: function(pUser, pText){
            pText = pText.replace("@", "^").trimRight() + "$";
            console.log(JSON.stringify(mUsers));
            var sUser = FindByName(pText);
            if(sUser.length > 0) sUser = sUser[0];
            else return;
            if(IsMe(sUser) || Is_Moderator(pUser) || Is_SuperUser(pUser) || Is_Owner(pUser)) return;
            
            Insert("bans", {userid: sUser.userid});
            mBot.bootUser(sUser.userid, "You're banned.  Gtfo.");
        },
        requires: Requires.Moderator, 
        hint: "Add a user to the ban list and kicks them from the room."
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
            pText = pText.replace("@", "^").trimRight() + "$";
            var sUser = FindByName(pText);
            if(sUser.length > 0) sUser = sUser[0];
                mBot.remDj(sUser.userid);
        },
        requires: Requires.Moderator,
        hint: "Remove a DJ"
    },
    {
        command: 'gtfo',
        callback: function(pUser, pText){
            pText = pText.replace("@", "^").trimRight() + "$";
            var sUser = FindByName(pText);
            if(sUser.length > 0) sUser = sUser[0];
                mBot.bootUser(sUser.userid, "Not in my kitchen.");
        },
        requires: Requires.Moderator,
        hint: "Remove a DJ"
    },
    {
        command: 'stagedive',
        message: ["{username} is surfing the crowd!", "Oops! {username} lost a shoe sufing the crowd.", "Wooo! {username}'s surfin' the crowd! Now to figure out where the wheelchair came from...", "Well, {username} is surfing the crowd, but where did they get a raft...", "{username} dived off the stage...too bad no one in the audience caught them.", "{username} tried to jump off the stage, but kicked their laptop. Ouch.", "{username} said they were going to do a stagedive, but they just walked off.", "And {username} is surfing the crowd! But why are they shirtless?", "{username} just traumatized us all by squashing that poor kid up front."],
        callback: function(pUser, pText){
            if(mDJs.indexOf(pUser.userid) != -1) {
                mBot.remDj(pUser.userid);
                var sMessage = mRandomItem(this.message);
                Speak(pUser, sMessage, SpeakingLevel.Misc);
              }
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
            exec(pText + " = null");
        },
        requires: Requires.Moderator,
        hint: "Used to disable variables."
    },
    {
        command: 'settheme',
        callback: function(pUser, pText){
            mTheme = pText;
            mParsing['{theme}'] = mTheme;
            Speak(pUser, mThemeIs, SpeakingLevel.Misc);
        },
        requires: Requires.Moderator,
        hint: "Set/change the theme."
    },
    {
        command: 'djs',
        callback: function(pUser, pText){
            var sDJSongCount = [];
            for(var sDJ in mSongCount){
                var sUser = mUsers[sDJ];
                var sSongCount = mSongCount[sDJ];
                sDJSongCount.push(sUser.name + ": " + sSongCount);
            }
            Speak(pUser, mCurrentDJSongCount, SpeakingLevel.Misc,[['{djsandsongcount}', sDJSongCount.join(', ')]]);
        },
        requires: Requires.User,
        hint: "Tells the current song count for the DJs."
    },
    {
        command: 'commands',
        callback: function(pUser, pText){
            var sCommands = [];
            mCommands.forEach(function(pCommand){
                if(pCommand.requires.check(pUser) && !(pCommand.hidden))
                    sCommands.push(pCommand.command);
            });
            Speak(pUser, mCommandsList, SpeakingLevel.Misc, [['{commands}', sCommands.join(', /')]]);
        },
        requires: Requires.User,
        hint: "Tells what all the commands are."
    },
    {
        command: 'theme',
        callback: function(pUser, pText){
            Speak(pUser, mThemeIs, SpeakingLevel.Misc);
        },
        requires: Requires.User,
        hint: "Tells what the theme is.",
        bare: true
    },
    {
        command: 'dance',
        callback: function(pUser, pText){
            if(!mModBop || Is_Moderator(pUser))mBot.vote("up");
        },
        requires: Requires.User,
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
        command: 'order',
        callback: function(pUser, pText){
            HandleMenu(pUser, pText);
        }, 
        requires: Requires.User, 
        hint: "Order something off the menu."
    }
];
