module.exports = function(app)
{
    app.socketfunctions.admin.getRolesAdmin = async (socket, data ,trx) =>
    {
        if(socket.session && socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editrole)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }
             var roles = await app.knex("roles").select("*");
 
             var promises = [];
 
             for(var role of roles)
             {
                 promises.push(await app.knex("users").where({role_id: role.id}).count());
             }
 
             var usercounts = await Promise.all(promises);
             
             for(var i in usercounts)
             {
                 roles[i].usercount = usercounts[i];
             }
      
             data.result = roles;
      
             await app.socketio.ioreq.Response(data);
        }
        else
        {
             data.result = false;
             await app.socketio.ioreq.Response(data);
        }
    }

    app.socketfunctions.admin.newRole = async(socket, req, trx) => 
    {
        if (
            socket.session &&
            socket.session.user
        ) 
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editrole)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }

            if((await app.knex("roles").select("name").where({name : req.data.name})).length > 0)
            {
                req.result = {result: false, err: "rolenamealeadyexist"}
                await app.socketio.ioreq.Response(req);
                return;
            };

            await app.knex("roles").insert({
                name: req.data.name, 
                grantadmin: req.data.grantadmin ? true : false,
                editrole: req.data.editrole ? true : false,
                useredit: req.data.useredit ? true : false,
                allowregister: req.data.allowregister ? true : false,
                changesettings: req.data.changesettings ? true : false,
                editthread: req.data.editthread ? true : false,
            });

            let role = (await app.knex("roles").select("id").where({name : req.data.name}))[0].id;
            if(req.data.userid.length > 0)
                await app.knex("users").update({role_id: role}).whereIn("id",req.data.userid);
            if(!role || role.length == 0)
            {
                req.result = false;
                await app.socketio.ioreq.Response(req);
            }
            else
            {
                req.result = true;
                await app.socketio.ioreq.Response(req);
            }
        }
        else {
            req.result = {result: false, err: "doesnothavepermission"}
            await app.socketio.ioreq.Response(req);
        }
    }

    app.socketfunctions.admin.adminRoleAction = async function(socket, req, trx)
    {
        if(
            socket.session &&
            socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editrole)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }

            if(req.data.action == 'delete'){
                await app.knex("users").whereIn("role_id", req.data.id).update({role_id: 1});
                await app.knex("roles").whereIn("id",req.data.id).del();
                req.result = true;
                await app.socketio.ioreq.Response(req);
            }
            else
            {
                req.result = {result: false, err: 'unknown action'};
                await app.socketio.ioreq.Response(req);                
            }
        }
    }

    app.socketfunctions.admin.adminRoleAssign = async function(socket, req, trx)
    {
        if(
            socket.session &&
            socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editrole)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }
            
            await app.knex("users").whereIn("id" ,req.data.userid).update({role_id: req.data.id[0]});
            req.result = true;
            await app.socketio.ioreq.Response(req);
        }
        else {
            req.result = {result: false, err: "doesnothavepermission"}
            await app.socketio.ioreq.Response(req);
        }
    }

    app.socketfunctions.admin.getUserAdmin = async (socket, req, trx) =>{
        if(!socket.session.user.admin || !socket.session.user.admin.useredit)
        {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
            return;
        }

        var query = {id: req.data.id};
        req.result = await app.knex("users").select("*").where(query);
        await app.socketio.ioreq.Response(req);
    }

    app.socketfunctions.admin.editUser = async (socket, req, trx) =>{
        if(!socket.session.user.admin || !socket.session.user.admin.useredit)
        {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
            return;
        }
        
        if(req.data.id)
        {
            let target = {};
            target.uid = req.data.uid;
            target.nickname = req.data.nickname;
            //target.email = req.data.email;
            //target.phonenumber = req.data.phone;
            if(target.password && target.password.length > 0)
            {
                let [pw, salt] = app.utils.hash.hashPassword(req.data.password);
                target.password = pw;
                target.salt = salt;
            }

            await app.knex("users").where({id: req.data.id}).update(target);

            req.result = true;
            await app.socketio.ioreq.Response(req);
            return;
        }
        else
        {
            let [pw, salt] = app.utils.hash.hashPassword(req.data.password);
            await app.knex("users").insert({uid: req.data.uid, nickname: req.data.nickname, salt: salt, password: pw, role_id: req.data.roleid});
            req.result = true;
            await app.socketio.ioreq.Response(req);
            return;
        }
    }

    app.socketfunctions.admin.getUsersAdmin = async (socket, req, trx) =>{
        if(!socket.session.user.admin || !socket.session.user.admin.useredit)
        {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
            return;
        }
        if(req.data.category)
        {
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
            req.result = await app.knex('users').select("*").where(query);
        }
        else
        {
            req.result = await app.knex('users').select("*");
        }
        await app.socketio.ioreq.Response(req);
    }

    app.socketfunctions.admin.adminUserAction = async function(socket, req, trx)
    {
        if(
            socket.session &&
            socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.useredit)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }

            if(req.data.action == 'delete'){
                await app.knex('users').whereIn("id" , req.data.id).del();
                req.result = true;
                await app.socketio.ioreq.Response(req);
            }
            else
            {
                req.result = {result: false, err: 'unknown action'};
                await app.socketio.ioreq.Response(req);                
            }
        }
    }

    app.socketfunctions.admin.adminDeleteThread = async function(socket, req, trx)
    {
        if(
            socket.session &&
            socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editthread)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }

            await app.knex("threads").where({id : req.data.id}).del();
            req.result = true;
            await app.socketio.ioreq.Response(req);
        }
        else
        {
            req.result = false;
            await app.socketio.ioreq.Response(req);
        }
    }

    app.socketfunctions.admin.adminDeleteGeolocation = async function(socket, req, trx)
    {
        if(
            socket.session &&
            socket.session.user)
        {
            if(!socket.session.user.admin || !socket.session.user.admin.editthread)
            {
                req.data.result = false;
                await app.socketio.ioreq.Response(req);
                return;
            }

            let geo = await app.knex("geolocations").where(app.knex.postgis.dwithin("coordinates",app.knex.postgis.geography(app.knex.postgis.makePoint(req.data.longitude, req.data.latitude)), 0.001));
            let geoid = geo[0].id;
            await app.knex("threads").where({geolocation_id : geoid}).del();
            await app.knex("geolocations").where({id : geoid}).del();
            req.result = true;
            await app.socketio.ioreq.Response(req);
        }
        else
        {
            req.result = false;
            await app.socketio.ioreq.Response(req);
        }
    }
}