/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 */

global.mCommands = [
    { 
        command: '/help',
        callback: function(pUser, pText){
            Speak(pUser, mHelpMsg, SpeakingLevel.Misc);
        }, 
        requires: Requires.User,
        hint: "Gives the users some pretty basic help and advice."
    },
    {
        command: '/refresh',
        callback: function(pUser, pText){
            /// Reload the variable + its coresponding collection.
        }, 
        requires: Requires.Owner, 
        hint: "Reloads the variable + its corresponding collection."
    },
    {
        command: '/ban',
        callback: function(pUser, pText){
            /// Ban a user
            ///     Add to ban list, and kick from room.
        },
        requires: Requires.Moderator, 
        hint: "Add a user to the ban list and kicks them from the room."
    },
    {
        command: '/say',        
        callback: function(pUser, pText){
            /// Dalton's equivalent of PM'ing say Blahblahblah...
        }, 
        requires: Requires.Moderator, 
        hint: "Makes the bot say something."
    },
    {
        command: '/q+', ///TODO: What if they're already a DJ?
        callback: function(pUser, pText){
            if(mDJs.length == mMaxDJs) QueuePush(pUser.userid);
            else Speak(pUser, mOpenSpotNoQueueing, SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "Used to join the queue."
    },
    {
        command: '/q',          
        callback: function(pUser, pText){
            Speak(pUser, mQueueStatus, SpeakingLevel.Misc);
        }, 
        requires: Requires.User, 
        hint: "Tells what the current status of the queue is."
    }
];