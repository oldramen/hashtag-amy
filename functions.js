/*
    Copyright 2012 yayramen && Inumedia.
    This is the functions file, where the magic happens.
    This file contains all the information and functions
    that make the bot actually work. The heart of the entire operation.
*/
global.Log = function(pOutput){
    console.log(mName,">>>", pOutput + ".");
};

global.OnRegistered = function(pData){
    if(pData.user.length == 0) return;
    if(IsMe(pData.user[0])) BootUp();
    if(!IsMe(pData.user[0])){
        Update_User(pData.user[0]);
        Greet(pData.user[0]);
    }
};

global.OnDeregistered = function(pData){
    for(var i = 0, len = pData.user.length; i < len; ++i) Remove_User(pData.user[i]);
};

global.OnGotRoomInfo = function(pData){
    Log("Got Room Data");
    mRoomName = pData.room.name;
    for(var i = 0, len = pData.users.length; i < len; ++i) Update_User(pData.users[i]);
    RefreshMetaData(pData.room.metadata);
};

global.OnNewModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = true;
    else mModerators[pData.userid] = true;
    Log(data.name + " is now a moderator");
};

global.OnRemModerator = function(pData){
    if(!pData.success) return;
    if(IsMe(pData.userid)) mIsModerator = false;
    else delete mModerators[pData.userid];
    Log(data.name + " is no longer a moderator");
};

global.OnAddDJ = function(pData){
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);           /// Refresh room data.
        IsLonely();                     /// Lonely DJ
    });  
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    if(mQueueOn) GuaranteeQueue();      /// Guarantee that the net user in the queue is getting up.
};

global.OnRemDJ = function(pData){
    mBot.roomInfo(function(pData){
        OnGotRoomInfo(pData);           /// Refresh current DJs
        IsLonely();                     /// Lonely DJ
    });
    console.log(JSON.stringify(pData));
    Update_User(pData.user[0]);         /// Refreshing the information of the DJ that was added.
    if(mQueueOn) QueueAdvance();        /// Advance the queue to the next person in line.
};

global.OnSpeak = function(pData){
    
}

function QueueAdvance(){
    
}

function GuaranteeQueue(){
    
}

function Greet(pUser){
    var sGreeting = mGreeting;
    ///if(Is_VIP(pUser)) sGreeting = mVIPGreeting;
    if(Is_SuperUser(pUser)) sGreeting = mSuperGreeting;
    var sOwnGreeting = mGreetings.filter(function(e){ return e.userid == pUser.userid; });
    if(sOwnGreeting && sOwnGreeting.length > 0) sGreeting = sOwnGreeting[0];
    sGreeting = sGreeting.replace(/\{username\}/gi, pUser.name);
    sGreeting = sGreeting.replace(/\{room\}/gi, mRoomName);
    mBot.speak(sGreeting);
    Log(sGreeting);
}

function RefreshMetaData(pMetaData){
    if(pMetaData.current_song)
        mSongName = pMetaData.current_song.metadata.song;
    mUpVotes = pMetaData.upvotes;
    mDownVotes = pMetaData.downvotes;
    mDJs = [];
    for(var i = 0, len = pMetaData.djs.length; i < len; ++i) mDJs[i] = pMetaData.djs[i];
    mCurrentDJ = pMetaData.current_dj;
    mIsModerator = _.any(pMetaData.moderator_id, function(pId){ return pId == mUserId; });
    for(var i = 0, len = pMetaData.moderator_id.length; i < len; ++i) mModerators[pMetaData.moderator_id[i]] = true;
}

function IsLonely() {
    if(mDJs.length == 1 && (mDJs.indexOf(mUserId) == -1)) mBot.addDj();
    if((mDJs.length > 2 || mDJs.length == 1 ) && (mDJs.indexOf(mUserId) != -1)) mBot.remDj();
}

function BootUp(){
    Log("Joined the room.  Booting up");
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
    if(pUser.userid in mUsers)
        Log(pUser.name + " updated");
    else
        Log(pUser.name + " joined the room" + (mRoomName === "" ? "" : " " + mRoomName));
    mUsers[pUser.userid] = pUser.name;
    Update_AFKTime(pUser);
    /// Handle booting for bans here.
    
    /*This code needs to be a lot more simple this function will be called a lot of places, 
    so there's no need for banstuffs here, or joining the room.  We can handle that in another
    function, or even just in the on registered call. Also, I'd like to see a tab system here. 
    Everytime the user is updated, i.e., on speak, add dj, whatnot, the user.worth gets updated.
    We'll have things for the user to 'buy' later to decrease this worth. So, all this function 
    needs is update name, update idle, add worth.*/
}

/* 
AND HERE WE HAVE MY SUGGESTIONS FOR UPDATE USER TYPE STUFF.

function updateUser(pUser, pHow) {
    mUsers[pUser.userid] = pUser.name;
    Update_AFKTime(pUser);
    payUser(pUser, pHow);
}
function payUser(pUser, pHow) {
    var x;
    if (pHow == 'speak') x = Math.floor(Math.random()*2+1);
    if (pHow == 'add_dj') x = Math.floor(Math.random()*3+1);
    if (pHow == 'upvote') x = Math.floor(Math.random()*5+1);
    if (!worth[pUser.userid]) worth[pUser.userid] = 0;
    var cash = worth[pUser.userid];
    worth[pUser.userid] = cash+x;
}

NOT SAYING IT WOULD WORK, JUST SAYING SOMETHING ALONG THOSE LINES ;D
*/

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

global.InitMongoDB = function(){
    var sConnectionString = mMongoUser+':'+mMongoPass+"@"+mMongoHost+":"+mMongoPort+"/"+mMongoDatabase+"?auto_reconnect";
    Log("Connecting to: " + sConnectionString);
    mMongoDB = mMongo.db(sConnectionString);
};

global.Refresh = function(pFrom, pCallback){
    Log("Refreshing: "+ pFrom);
    var sCollection = mMongoDB.collection(pFrom);
	if(!sCollection) return false;
    sCollection.find().toArray(pCallback);
    return true;
};

global.Insert = function(pTo, pData){
    mMongoDB.collection(pTo).insert(pData);
};

global.Remove = function(pFrom, pData){
    mMongoDB.collection(pFrom).remove(pData);
};