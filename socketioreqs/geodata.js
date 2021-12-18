module.exports = function(app)
{
    app.socketfunctions.geo.getGeolocations = async (socket ,msg, trx) => {
        let geos = await app.knex("geolocations")
        .select(app.knex.postgis.x("coordinates").as("longitude"),app.knex.postgis.y("coordinates").as("latitude"));
        msg.result = geos;
        await app.socketio.ioreq.Response(msg);
    }

    app.socketfunctions.geo.makeGeolocation = async (socket ,msg, trx) => {
        if(socket.session && socket.session.user)
        {
            let coordid = await app.knex("geolocations").select("id").where({coordinates: app.knex.postgis.setSRID(app.knex.postgis.makePoint(msg.data.longitude, msg.data.latitude), 4326)});
            if(coordid.length > 0)
            {
                msg.result = {result: false, error: 'That coordinates already exists.'};
                await app.socketio.ioreq.Response(msg);
                return;
            }
            await app.knex("geolocations").insert({coordinates: app.knex.postgis.setSRID(app.knex.postgis.makePoint(msg.data.longitude, msg.data.latitude), 4326)});
            msg.result = {result: true};
            await app.socketio.ioreq.Response(msg);
        }
        else
        {
            msg.result = {result: false, error: 'You have not signed in.'};
        }
    }
}