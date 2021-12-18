async function getSelfUserData()
{
    var result = await window[windowid].socket.ioreq.Request('request',{rgroup: 'user', request: 'getSelfUserData'});
    if(result)
    {
        window[windowid].user = result;
    }
    return result;
}

async function signIn(id, password, captcha)
{
    var result = await window[windowid].socket.ioreq.Request('request', {uid: id, password: password,captcha: captcha, rgroup: 'user', request: 'signIn'});
    if(result.result)
    {
        getSelfUserData();
        location.reload();
    }
    else
    {
        alert(result.error);
    }
    return false;
}