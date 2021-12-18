async function Wrapper(){
    var socket = await io('/',{secure: true, transports: [ 'websocket' ]});
    socket.ioreq = new SocketIOPromise(socket);
    window[windowid].socket = socket;

    getSelfUserData();
    socket.on('error', function(msg)
    {
        alert(msg);
    });

}

if(!window[windowid].socket)
{
    Wrapper();
}