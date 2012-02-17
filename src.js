//This is where everything happens
//All of the main code will be here, and it will require
//any external files.

/*THINGS TO DO (maybe):

on REGISTER
    if is bot
        get roominfo
        set vars for roomid, roomname
        log all the users currently in the room
        updateidletimes for all users in room
        update current song and votes
        add djs to djlist, count first song for dj
        check for mods
        check if bot is mod
    else
        check if user banned
            if banned, boot, else return
        log user
        update idle for user
        fan user
        if babble is false
            check if user has custom greeting
                greet with custom greeting
            else check if user is SU
                greet with SU greeting
            else check if user is VIP
                greet with vip greeting
            else greet with regular greeting
    done
    
on DEREGISTER
    unlog user
    if in queue, delete from queue
    if has status, delete status
    done

on UPDATE VOTES
    if songName defined
        get room info
        songName = song name
    updateidle of user
    upvotes = awesomes
    downvotes = lames

on NEW SONG
    if song != current song
        say last song, with upvotes and downvotes
    clear  last song / votes - set the new ones
    if song limit on 
        if last dj song count = maxsongs 
            if overmax > 0
                warn dj he has reached the limit
        if any other dj song count > max songs + oversongs
            remove dj
        subtract wait count from djs who are waiting
        if waitcount = 0, delete from waitint  
    log current dj
    add count to song count for dj
    

on SNAGGED
    vote up
    done
    
on NEW MOD
    if is bot
        log that bot is mod
    else
        log new mod; add to list
    done

on REM MOD
    if is bot
        log that bot is not mod
    else
        remove old mod from mod list
    done
    
on ADD DJ
    updateidle of user
    ger room info
    if 1 dj on deck
        add bot as dj
    else if bot is dj && > 2 djs on deck
        rem bot as dj
    if queue is on && people in queue
        if user is next
            delete user from queue
        else
            rem user (?)
            say not his turn, notify user who IS next of turn
        done
    if song limits on
        if dj is waiting && not vip
            remove dj, tell dj how many more songs to wait
        if dj has old song count && dj'd less than cleartime ago
            add old song count back
            *cleartime = amount of time to reset song count
        else remove old song count && song count = 0
    done
    
on REM DJ
    updateidle of user
    getroominfo
    if 1dj on deck && bot is that dj
        rem bot as dj
    else if 1dj on deck 
        add bot as dj
    if queue enabled
        if someone in queue
            say next is next
    if user has song count
        old song count = new song count
        log time of last dj
        
on SPEAK
    updateidle of user
    check for commands
    if command, run command
        









*/