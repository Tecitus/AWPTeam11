async function getPagesAdmin()
{
    var result = await window[windowid].socket.ioreq.Request('request',{rgroup: 'admin', request: 'getPagesAdmin'});
    return result;
}

async function getRolesAdmin()
{
    var result = await window[windowid].socket.ioreq.Request('request',{rgroup: 'admin', request: 'getRolesAdmin'});
    return result;
}

async function getUsersAdmin(index, amount)
{
    var obj = {rgroup: 'admin', request: 'getUsersAdmin'};
    index ? obj.index = index : undefined;
    amount ? obj.amount = amount : undefined;
    var result = await window[windowid].socket.ioreq.Request('request', obj);
    return result;
}