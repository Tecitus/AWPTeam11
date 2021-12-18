const svgCaptcha = require('svg-captcha');
module.exports = function(app)
{
    app.socketfunctions.user.getSelfUserData = async (socket, msg, trx) =>{
        if(socket.session && socket.session.user)
        {
            var re = {};
            re.uid = socket.session.user.uid;
            re.nickname = socket.session.user.nickname;
            re.id = socket.session.user.id;
            if(socket.session.user.admin)
            {
                re.isadmin = true;
                re.admin = socket.session.user.admin;
            }
            msg.result = re;
        }
        else
        {
            msg.result = false;
        }
        await app.socketio.ioreq.Response(msg);
    }
    
    app.socketfunctions.user.getLoginCaptcha = async (socket ,msg, trx) => {
        let captcha = svgCaptcha.create({size: 6});
        socket.session.logincaptcha = captcha.text;
        msg.result = captcha.data;
        await app.socketio.ioreq.Response(msg);
    }

    app.socketfunctions.user.signIn = async (socket, msg, trx) =>{
        if(app.env.DEBUG) console.log(msg)
        if(msg.data.captcha != socket.session.logincaptcha)
        {
            msg.result = {result: false, error: 'captchadoesnotmatch'};
            await app.socketio.ioreq.Response(msg);
            return;
        }
        else
        {
            socket.session.logincaptcha = undefined;
        }
        if(socket.session && socket.session.user)
        {
            msg.result = {result: false, error: 'Something is wrong.'};
            await app.socketio.ioreq.Response(msg);
        }
        else
        {
            var result = await app.knex.select().from('users').where({uid: msg.data.uid}).first().transacting(trx);
            if(result)
            {
                var pwc = app.utils.hash.hashPassword(msg.data.password, result.salt);
                if(pwc == result.password)
                {
                    socket.session.user = result;
                    let threads = await app.knex("roles")
                    .innerJoin('users','roles.id','=','users.role_id')
                    .select('roles.name', 'roles.grantadmin', 'roles.editrole', 'roles.useredit','roles.allowregister', 'roles.changesettings' ,'roles.editthread')
                    .where({'users.id':socket.session.user.id});
                    if(threads[0].grantadmin || threads[0].editrole || threads[0].useredit || threads[0].allowregister || threads[0].changesettings || threads[0].editthread)
                    {
                        socket.session.user.isadmin = true;
                        socket.session.user.admin = threads[0];
                    }
                    msg.result = {result: true};
                    await app.socketio.ioreq.Response(msg);
                }
                else
                {
                    msg.result = {result: false, error: 'Id or Password does not exist.'};
                    await app.socketio.ioreq.Response(msg);
                }
            }
            else
            {
                msg.result = {result: false, error: 'Id or Password does not exist.'};
                await app.socketio.ioreq.Response(msg);
            }
        }
    }

    app.socketfunctions.user.register = async(socket, msg, trx) => {
        //Already loggedin
        if(socket.session.user)
        {
            msg.result = {result: false, err: 'Aleady signed in.'};
            await app.socketio.ioreq.Response(msg);
            return;
        }

        if(app.settings.allowregister == 'false')
        {
            msg.result = {result: false, err: 'registernotallowed'};
            await app.socketio.ioreq.Response(msg);
            return;
        }
        else if(msg.data.uid && msg.data.nickname && msg.data.password)
        {
            var result = await app.knex.select('*').from('users').where({uid: msg.data.uid}).transacting(trx);
            if(result.length > 0)
            {
                //UID already exist;
                msg.result = {result: false, err: 'ID already exist.'};
                await app.socketio.ioreq.Response(msg);
                return;
            }
            result = await app.knex.select().from('users').where({nickname: msg.data.nickname}).transacting(trx);
            if(result.length > 0)
            {
                //Nickname already exist;
                msg.result = {result: false, err: 'Nickname already exist.'};
                await app.socketio.ioreq.Response(msg);
                return;
            }
            var [pw, salt] = app.utils.hash.hashPassword(msg.data.password);
            await app.knex('users').insert({uid: msg.data.uid, nickname: msg.data.nickname, password: pw, salt: salt});
            result = await app.knex.select('*').from('users').where({uid: msg.data.uid}).transacting(trx);
            socket.session.user = result[0];
            msg.result = {result: true};
            await app.socketio.ioreq.Response(msg);
        }
        else
        {
            //Something is wrong
        }
    }

    app.socketfunctions.user.getRoles = async (socket, msg, trx) =>{
        if(msg.data.value == "")
        {
            msg.result = await app.knex('roles').select("id", "name");
            await app.socketio.ioreq.Response(msg);
            return;
        }
        var query = {};
        if (msg.data.category == "id")
            query["id"] = msg.data.value;
        else
            query[msg.data.category] = msg.data.value + "%";
        msg.result = await app.knex('roles').select("id", "name").where(query);
        await app.socketio.ioreq.Response(msg);
    }

    app.socketfunctions.user.getUsers = async (socket, msg, trx) =>{
        if(msg.data.value == "")
        {
            msg.result = [];
            await app.socketio.ioreq.Response(msg);
            return;
        }
        var query = {};
        if (msg.data.category == "id")
            query["id"] = msg.data.value;
        else
            query[msg.data.category] = msg.data.value + "%";
        msg.result = await app.knex("users").select("id", "uid", "nickname").where(query);
        await app.socketio.ioreq.Response(msg);
    }
}