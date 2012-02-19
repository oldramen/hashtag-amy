global.Log = function(pOutput){
    console.log(mName,">>>", pOutput + ".");
}

global.OnRegistered = function(pData){
    if(pData.user.length == 0) return;
    if(IsMe(pData.user[0])) Boot(pData);
    for(var i = 0, len = pData.user.length; i < len; ++i) Update_User(pData.user[i]);
    if(!IsMe(pData.user[0])){
        Greet(pData.user[0]);
    }
}

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user; i < len; ++i) Remove_User(pData.user[i]);
}

global.OnGotRoomInfo = function(pData){
    global.mRoomName = pData.room.name;
    for(var i = 0, len = pData.users; i < len; ++i) Update_User(pData.users[i]);
    if(pData.room.metadata.current_song) RefreshMetaData(pData.room.metadata);
}

function Greet(pUser){
    Log("We'll just pretend we're greeting "+pUser.name+" for now.");
}

function RefreshMetaData(pMetaData){
    mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    for(var i = 0, len = pMetaData.djs; i < len; ++i) mDJs[i] = pMetaData.djs[i];
    mCurrentDJ = pMetaData.current_dj;
    mIsModerator = _.any(pMetaData.moderator_id, function(pId){ return pId == mUserId; });
    for(var i = 0, len = pMetaData.moderator_id; i < len; ++i) mModerators[i] = pMetaData.moderator_id[i];
}

function Boot(pData){
    SetMyName(mName);
    mBot.roomInfo(RefreshRoomInfo);
}

function IsMe(pUser){
    return pUser.userid == mUserId;
}

function SetMyName(pName){
    mAmy.modifyProfile({ name: pName });
    mAmy.modifyName(pName);
}

function Remove_User(pUser){
    delete mUsers[pUser.userid];
    delete mAFKTimes[pUser.userid];
}

function Update_User(pUser){
    mUsers[pUser.userid] = pUser.name;
    Update_AFKTime(pUser);
    log(pUser.name + " joined the room.");
    /// Handle booting for bans here.
}

function Update_AFKTime(pUser){
    var sDate = new Date();
    mAFKTimes[pUser.userid] = sDate.getTime();
}