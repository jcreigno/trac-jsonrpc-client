var jsonrpc = require('../json-rpc');
var cli = new jsonrpc('http://trac-host/trac/env/login/rpc');

cli.proxy(function(err, p){
    p.system.getAPIVersion(function(err, data, result){
        if(err){
            console.log('error : %s', err.message || data.message);
        } else{
            console.log('Server JSON RPC API version is ' + result.join('.'));
        }
    });
});