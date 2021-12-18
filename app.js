var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const redis = require('redis');
const session = require('express-session');
const fs = require('fs');
var sharedsession = require("express-socket.io-session");
const { env, exit } = require('process');
const knexPostgis = require("knex-postgis");
const http = require('https');
var app;
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

async function Wrapper(){
    let config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
    var sslOptions = {

    key: fs.readFileSync(config.certkey,'utf8'),
    cert: fs.readFileSync(config.cert,'utf8'),

    };
    app = express();
    app.configs = config;
    var server = http.createServer(sslOptions, app);
    var socket = require('socket.io');
    //var io = socket(server);
    var io = socket();
    io.attach(server);
    const knex = require('knex')({
    client: 'postgresql',
    connection: {
        host : config.dbhost,
        port : config.dbport,
        user : config.dbuser,
        password : config.dbpassword,
        database : config.dbname
    }
    });
    await knexPostgis(knex);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.socketio = io;
    app.socketio.ioreq = new (require(__dirname + '/socketiopromise.js'))(app.socketio);
    app.knex = knex;
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use("/public",express.static(path.join(__dirname, 'public')));
    app.env = env;
    app.utils = require(__dirname + '/utils.js');
    app.langdata = {};

    let RedisStore = require('connect-redis')(session)
    let redisClient = redis.createClient({port: config.redisport,host: config.redishost,db: config.redisdb})
    var sess = session({
        store: new RedisStore({ client: redisClient, prefix: 'awpsess:' }),
        saveUninitialized: true,
        secure: true,
        secret: 'advancedwepprogramming',
        resave: true,
    });
    app.use(sess);
    io.use(sharedsession(sess, {
        autoSave:true
    }));

    var routes = fs.readdirSync(path.join(__dirname,"routes"),{withFileTypes: true}).
        filter(dirent => (dirent.isFile()))
        .map(dirent => dirent.name);
    for(var r of routes)
    {
        require(path.join(__dirname,'routes',r))(app);
    }

    if(!await knex.schema.hasTable('users'))
    {
        await require(path.join(__dirname, 'db','tables.js'))(app);
        await app.knex('settings').insert({name:"windowid", value: app.utils.etc.makewindowid(16)});
        await app.knex('roles').insert({name:"default"});
        await app.knex('roles').insert({name:"superuser", grantadmin: true, editrole: true, useredit: true, allowregister:true, changesettings:true, editthread:true});
        var [pw, salt] = app.utils.hash.hashPassword("admin");
        await app.knex('users').insert({uid: "admin", nickname: "Administer", password: pw, salt: salt, role_id: 2});
    }
    
    var serversettings = await knex.select().from('settings');
    app.serversettings = {};
    for(var k in serversettings)
    {
        app.serversettings[serversettings[k]['name']] = serversettings[k]['value'];
    }
    app.socketfunctions = {core: {}, user:{}, geo:{}, admin:{}, thread:{}}

    var sioreqs = fs.readdirSync(path.join(__dirname,"socketioreqs"),{withFileTypes: true}).
        filter(dirent => (dirent.isFile()))
        .map(dirent => dirent.name);
    for(var s of sioreqs)
    {
        require(path.join(__dirname,'socketioreqs',s))(app);
    }   

    var langs = fs.readdirSync(path.join(__dirname,"langs"),{withFileTypes: true}).
        filter(dirent => (dirent.isFile()))
        .map(dirent => dirent.name);
    for(var r of langs)
    {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'langs', r)));
        var langname = path.basename(r,'.json');
        if(langname in app.langdata)
        {
            app.langdata[langname].translation = Object.assign(app.langdata[langname].translation, data);
        }
        else
        {
            app.langdata[langname] = {};
            app.langdata[langname].translation = data;
        }
    }
    
    app.socketio.on('connection',async (socket) => {
        socket.on('request', async (req)=>
        {
            console.log(req);
            let starttime = Date.now();

            if(req.data.rgroup && req.data.request)
            {
                try {
                    await knex.transaction(async trx => {
                        await app.socketfunctions[req.data.rgroup][req.data.request](socket.handshake, req, trx);
                        socket.handshake.session.save();
                    })
                } 
                catch (error) {
                    // If we get here, that means that neither the 'Old Books' catalogues insert,
                    // nor any of the books inserts will have taken place.
                    console.error(error);
                }
            }

            //if(app.env.DEBUG)
            console.log("Finished in "+(Date.now() - starttime).toString()+"ms");
        });
    });
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
    // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
            res.render('error');
    });

    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);
    server.on('error', onError);
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
            case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
            default:
            throw error;
        }
    }



    var debug = require('debug')('awp:server');
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

    server.on('listening', onListening);
    console.log("ready");
    server.listen(port);
}
Wrapper()
module.exports = app;
