trac-jsonrpc-client
===================

> nodejs client for the Trac JSON RPC api.

introduction
------------
Provide simple client to interact with a Trac server via JSONRPC. XmlRpcPlugin must be enabled on server.

Install
-------
```
 > npm install trac-jsonrpc-client
```


synopsis
--------
Simple low-level call using `callRpc` :

```javascript
  var jsonrpc = require('trac-jsonrpc-client');
  var client = jsonrpc('http://trac-host/trac/env/rpc');

  cli.callRpc('system.getAPIVersion',[],function(err, result){
    if(err){
      console.log(err);
    } else{
      console.log('Server JSON RPC API version is ' + result.join('.'));
    }
  });
```  

Using proxy client :

```javascript
  var jsonrpc = require('trac-jsonrpc-client');
  var cli = new jsonrpc('http://trac-host/trac/env/rpc');
  cli.proxy(function(err, p){
    // proxy is ready
    p.system.getAPIVersion(function(err, result){
      if(err){
        console.log(err);
      } else{
        console.log('Server JSON RPC API version is ' + result.join('.'));
      }
    });
  });
```

If authentification is required you need to specify a `username` and `password` :
```javascript
  var jsonrpc = require('trac-jsonrpc-client');
  var cli = new jsonrpc('http://trac-host/trac/env/login/rpc', {
    auth:{username:'tracuser',password:'hehehe'}
  });
```