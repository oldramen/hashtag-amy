/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 */

global.mCommands = [
    ['/help',       function(pData){
        /// Speak help.
    }, "Gives the users some pretty basic help and advice."],
    ['/refresh',    function(pData){
        /// Reload the variable + its coresponding collection.
    }, "Reloads the variable + its corresponding collection."],
    ['/ban',        function(pData){
        /// Ban a user
        ///     Add to ban list, and kick from room.
    }, "Add a user to the ban list and kicks them from the room."],
    ['/say',        function(pData){
        /// Dalton's equivalent of PM'ing say Blahblahblah...
    }, "Makes the bot say something."],
    ['/q+',         function(pData){
        /// Join the Queue.
    }, "Used to join the queue."],
    ['/q',          function(pData){
        /// What's the status of the queue and how to get in the queue
    }, "Tells what the current status of the queue is."]
];