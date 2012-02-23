/*
    Copyright 2012 yayramen && Inumedia.
    This is the enums file, where the speaking variables are stored.
    Change the value in the config files, controls how much the bot 
    spits out.
*/

///TODO: Add levels for Queue, Song Limit, and AFK.
global.SpeakingLevel = {
    Misc: {
        Val: 1,
        status: "Misc"
    },
    Greeting:{
        Val: 2,
        status: "Greeting"
    },
    SongChange:{
        val: 3,
        status: "SongChange"
    },
    DJChange:{
        val: 4,
        status: "DJChange"
    },
    MODChange:{
        val: 5,
        status: "MODChange"
    },
    Errors: {
        val: 6,
        status: "Errors"
    },
    Debug: { 
        val: 7,
        status: "Debug"
    },
    Verbose: {
        val: 8,
        status: "Verbose"
    }
}

global.Speaking = {
    Default: { 
        flags: [SpeakingLevel.Greeting, SpeakingLevel.Misc]
    },
    Shy: { 
        flags: [SpeakingLevel.Misc]
    },
    Silent: { 
        flags: []
    },
    Debug: {
        flags: [SpeakingLevel.Verbose]
    }
};

global.Requires = {
    User:       { val: 0, status: "User", check: function(pUser){ return true; } },
    VIP:        { val: 1, status: "VIP", check: function(pUser){ return Is_VIP(pUser); }},
    Moderator:  { val: 2, status: "Moderator", check: function(pUser){ return Is_Moderator(pUser); } },
    SuperUser:  { val: 3, status: "SuperUser", check: function(pUser){ return Is_SuperUser(pUser); } },
    Owner:      { val: 4, status: "Owner", check: function(pUser){ return Is_Owner(pUser); } }
}
