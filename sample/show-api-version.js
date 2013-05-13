var jsonrpc = require('../json-rpc');
var cli = new jsonrpc('http://trac-host/trac/env/login/rpc');

cli.callRpc('system.getAPIVersion',[],function(err, data, result){
    if(err){
        console.log(err);
    } else{
        console.log('Server JSON RPC API version is ' + result.join('.'));
    }
});