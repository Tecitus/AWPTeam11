module.exports = function(app)
{
    app.socketfunctions.thread.getThreadsFromGeolocation = async (socket ,msg, trx) => {
        let threads = await app.knex("geolocations")
        .join('threads','geolocations.id','=','threads.geolocation_id')
        .join('users', 'users.id', '=', 'threads.user_id')
        .select('threads.*','users.nickname')
        .where(app.knex.postgis.dwithin("coordinates",app.knex.postgis.geography(app.knex.postgis.makePoint(msg.data.longitude, msg.data.latitude)), 0.001));
        msg.result = threads;
        await app.socketio.ioreq.Response(msg);
    }

    app.socketfunctions.thread.makeNewThread = async (socket, msg, trx) =>
    {
        if(socket.session && socket.session.user)
        {
            let coordid = await app.knex("geolocations").select("id").where(app.knex.postgis.dwithin("coordinates",app.knex.postgis.geography(app.knex.postgis.makePoint(msg.data.longitude, msg.data.latitude)), 0.001));
            if(!coordid)
            {
                msg.result = {result: false, err: 'That coordinates does not exist.'};
                await app.socketio.ioreq.Response(msg);
                return;
            }
            coordid = coordid[0].id;
            await app.knex("threads").insert({content: msg.data.content, user_id: socket.session.user.id, geolocation_id: coordid});
            msg.result = {result: true};
            await app.socketio.ioreq.Response(msg);
        }
        else
        {
            msg.result = {result: false, err: 'You have not signed in.'};
        }
    }
}