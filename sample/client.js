var jsonrpc = require('../json-rpc');
var cli = new jsonrpc('http://trac-host/trac/env/rpc');

cli.proxy(function(err, p){
    p.system.getAPIVersion(function(err, result){
        if(err){
            console.log('error : %s', err);
        } else{
            console.log('Server JSON RPC API version is ' + result.join('.'));
        }
    });
});