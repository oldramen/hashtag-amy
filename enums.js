/*
    Copyright 2012 yayramen && Inumedia.
    This is the enums file, where the speaking variables are stored.
    Change the value in the config files, controls how much the bot 
    spits out.
*/

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
    User:       { val: 0, status: "User" },
    VIP:        { val: 1, status: "VIP" },
    Moderator:  { val: 2, status: "Moderator" },
    SuperUser:  { val: 3, status: "SuperUser" },
    Owner:      { val: 4, status: "Owner" }
}
