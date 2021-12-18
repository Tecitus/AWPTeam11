document.onloadevents = [];

async function getAvailableLanguageList()
{
    var langs = await window[windowid].socket.ioreq.Request('request',{rgroup: 'core', request: 'getAvailableLanguageList'});
    return langs;
}