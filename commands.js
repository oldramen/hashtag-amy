/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 */

global.mCommands = [
    ['/help',       function(pUser, pText){
        Log("/help o-o");
        /// Speak help.
    }, Requires.User, "Gives the users some pretty basic help and advice."],
    ['/refresh',    function(pUser, pText){
        /// Reload the variable + its coresponding collection.
    }, Requires.Owner, "Reloads the variable + its corresponding collection."],
    ['/ban',        function(pUser, pText){
        /// Ban a user
        ///     Add to ban list, and kick from room.
    }, Requires.Moderator, "Add a user to the ban list and kicks them from the room."],
    ['/say',        function(pUser, pText){
        /// Dalton's equivalent of PM'ing say Blahblahblah...
    }, Requires.Moderator, "Makes the bot say something."],
    ['/q+',         function(pUser, pText){
        /// Join the Queue.
    }, Requires.User, "Used to join the queue."],
    ['/q',          function(pUser, pText){
        /// What's the status of the queue and how to get in the queue
    }, Requires.User, "Tells what the current status of the queue is."]
];