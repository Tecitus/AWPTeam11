const { SHA3 } = require('sha3');
var rand = require('csprng');

var obj = {};
obj.hash = {};
obj.session = {};
obj.etc = {};
obj.etc.makewindowid = function (length) 
{ //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
obj.hash.sha3256 = new SHA3(256);
obj.hash.hashPassword = function(target, salt = undefined)
{
    if(!salt)
    {
        var salt = rand(320,36);
        obj.hash.sha3256.update(target + salt);
        var pw = obj.hash.sha3256.digest('utf8');
        obj.hash.sha3256.reset();
        return [pw, salt];
    }
    else
    {
        obj.hash.sha3256.update(target + salt);
        var pw = obj.hash.sha3256.digest('utf8');
        obj.hash.sha3256.reset();
        return pw;
    }
}


module.exports = obj;