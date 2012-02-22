/**
 * @copyright 2012 yayramen && Inumedia.
 * @author Inumedia
 * @description This is where all the commands are stored and loaded into runtime from.
 */

global.mCommands = [
    ['/help',       function(pData){
        /// Speak help command.
    }],
    ['/refresh',    function(pData){
        /// Reload the variable + its coresponding collection.
    }],
    ['/ban',        function(pData){
        /// Ban a user
        ///     Add to ban list, and kick from room.
    }],
    ['/say',        function(pDaya){
        /// Dalton's equivalent of PM'ing say Blahblahblah...
    }]
];