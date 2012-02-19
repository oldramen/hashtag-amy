/*
    Copyright 2012 yayramen && Inumedia.
    This is the enums file, where the speaking variables are stored.
    Change the value in the config files, controls how much the bot 
    spits out. 
*/
global.Speaking = {
    Default: { 
        debug: false,
        errors: false,
        greeting: true,
        misc: true
    },
    Shy: { 
        debug: false,
        errors: false,
        greeting: false,
        misc: true
    },
    Silent: { 
        debug: false,
        errors: false,
        greeting: false,
        misc: false
    },
    Debug: {
        debug: true,
        errors: true,
        greeting: true,
        misc: true
    }
};