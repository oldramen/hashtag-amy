/*
    Copyright 2012 yayramen && Inumedia.
    This is the functions file, where the magic happens.
    This file contains all the information and functions
    that make the bot actually work. The heart of the entire operation.
*/
global.Log = function(pOutput){
    console.log(mName,">>>", pOutput + ".");
}

global.OnRegistered = function(pData){
    if(pData.user.length == 0) return;
    if(IsMe(pData.user[0])) Boot();
    if(!IsMe(pData.user[0])){
        Update_User(pData.user[0]);
        Greet(pData.user[0]);
    }
}

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) Remove_User(pData.user[i]);
}

global.OnGotRoomInfo = function(pData){
    mRoomName = pData.room.name;
    for(var i = 0, len = pData.users.length; i < len; ++i) Update_User(pData.users[i]);
    if(pData.room.metadata.current_song) RefreshMetaData(pData.room.metadata);
}

global.OnNewModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = true;
    else mModerators[pData.userid] = true;
    Log(data.name + " is now a moderator");
}

global.OnRemModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = false;
    else delete mModerators[pData.userid];
    Log(data.name + " is no longer a moderator");
}

global.OnAddDJ = function(pData){
    mBot.roomInfo(OnGotRoomInfo);       /// Refresh current DJs
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    if(mQueueEnabled) GuaranteeQueue(); /// Guarantee that the net user in the queue is getting up.
}

global.OnRemDJ = function(pData){
    mBot.roomInfo(OnGotRoomInfo);       /// Refresh current DJs
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    if(mQueueEnabled) QueueAdvance();   /// Advance the queue to the next person in line.
}

function QueueAdvance(){
    
}

function GuaranteeQueue(){
    
}

function Greet(pUser){
    Log("We'll just pretend we're greeting "+pUser.name+" for now.");
}

function RefreshMetaData(pMetaData){
    mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i) mDJs[i] = pMetaData.djs[i];
    mCurrentDJ = pMetaData.current_dj;
    mIsModerator = _.any(pMetaData.moderator_id, function(pId){ return pId == mUserId; });
    for(var i = 0, len = pMetaData.moderator_id.length; i < len; ++i) mModerators[pMetaData.moderator_id[i]] = true;
}

function Boot(){
    Log("Joined the room.  Booting up.");
    SetMyName(mName);
    mBot.roomInfo(OnGotRoomInfo);
}

function IsMe(pUser){
    return pUser.userid == mUserId;
}

function SetMyName(pName){
    mBot.modifyProfile({ name: pName });
    mBot.modifyName(pName);
}

function Remove_User(pUser){
    delete mUsers[pUser.userid];
    delete mAFKTimes[pUser.userid];
}

function Update_User(pUser){
    if(mUsers.indexOf(pUser.userid) == -1) 
        Log(pUser.name + " joined the room" + (mRoomName === "" ? "" : " " + mRoomName));
    else
        Log(pUser.name + " updated");
    mUsers[pUser.userid] = pUser.name;
    Update_AFKTime(pUser);
    /// Handle booting for bans here.
}

function Update_AFKTime(pUser){
    var sDate = new Date();
    mAFKTimes[pUser.userid] = sDate.getTime();
}

function Is_Moderator(pUser){
    return _.any(mModerators, function(pId){ return pUser.userid === pId; });
}

function Is_SuperUser(pUser){
    return pUser.acl > 0;
}