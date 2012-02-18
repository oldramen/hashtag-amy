global.Log = function(pOutput){
    console.log("#Amy >>>", pOutput + ".");
}

global.OnRegistered = function(pData){
    if(pData.user.length == 0) return;
    if(IsMe(pData.user[0])) SetMyName(mName);
}

global.OnDeregistered = function(pData){
    
}

global.OnGotRoomInfo = function(pData){
    global.mRoomName = data.room.name;
    
}

function RefreshRoomInfo(){
    
}

function IsMe(pUser){
    return pUser.userid == mUserId;
}

function SetMyName(pName){
    mAmy.modifyProfile({ name: pName });
    mAmy.modifyName(pName);
}

function Update_User(pUser){
    mUsers[pUser.userid] = pUser.name;
}