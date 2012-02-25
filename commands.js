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
            Speak(pUser, mHelpMsg, SpeakingLevel.Misc);
        }, 
        requires: Requires.User,
        hint: "Gives the users some pretty basic help and advice.",
        bare: true
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
            
            ///Speak(pUser, "TODO", SpeakingLevel.Misc);
            /// Ban a user
            ///     Add to ban list, and kick from room.
        },
        requires: Requires.Moderator, 
        hint: "Add a user to the ban list and kicks them from the room."
    },
    {
        command: 'say',        
        callback: function(pUser, pText){
            mBot.speak(pText); //Speak(pUser, pText, SpeakingLevel.Misc);
            /// Dalton's equivalent of PM'ing say Blahblahblah...
        }, 
        requires: Requires.Moderator, 
        hint: "Makes the bot say something."
    },
    {
        command: 'q+', ///TODO: What if they're already a DJ?
                        ///TODO: What if they're already in the queue?
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
        command: 'disable',
        callback: function(pUser, pText){
            exec(pText + " = null");
        },
        requires: Requires.Moderator,
        hint: "Used to disable variables."
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
                if(pCommand.requires.check(pUser))
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
            mBot.vote("up");
        },
        requires: Requires.User,
        hint: "Makes the bot dance.  Can not be done by regular users."
    },
    {
        command: 'moo',
        callback: function(pUser, pText){
            HandleMenu(pText);
        }, 
        requires: Requires.User, 
        hint: "moo."
    },
    {
        command: 'order',
        callback: function(pUser, pText){
            HandleMenu(pText);
        }, 
        requires: Requires.User, 
        hint: "Order something off the menu."
    }
];
