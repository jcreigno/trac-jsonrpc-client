var util = require('util')
    ,_ = require('underscore')._
    ,EventEmitter = require('events').EventEmitter
    ,request = require('request');

//http://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
function assign(obj, keyPath, value) {
   var lastKeyIndex = keyPath.length-1;
   var key, i;
   for (i = 0; i < lastKeyIndex; ++ i) {
     key = keyPath[i];
     if (!obj[key]){
       obj[key] = {}
     }
     obj = obj[key];
   }
   obj[keyPath[lastKeyIndex]] = value;
}

function Jsonrpc (url, config){
    EventEmitter.call(this);
    var self = this;
    var cfg = _.defaults(config || {}, {'url' : url, json:true, 
        headers:{'Content-Type': 'application/json'}}
    );
    self.request = request.defaults(cfg);
}
util.inherits(Jsonrpc, EventEmitter);

module.exports = function(u, config){
    return new Jsonrpc(u, config);
};

Jsonrpc.prototype.callRpc = function(method, params, callback){
    //console.log('calling : ' + method
    //    + (params && params.length ? ' with ' + params:''));
    this.request.post(
        {body:JSON.stringify(
            {'method':method,
             'params':params,
             'id':new Date().getTime()})
        }, function(err, res, data){
            var error = err || data.error
            if(error){
                error.method = method;
                error.params = params;
                callback(error, null);
            }else{
                callback(null, data.result);
            }
        });
};

Jsonrpc.prototype.proxy = function(callback){
    var self = this;
    self.callRpc('system.listMethods',[], function (err, result){
        console.log
        if(err){
            console.log('unable to build proxy ' + err);
            self.emit('error', err);
            if(callback){
                callback(err, null);
            }
            return;
        }
        _.chain(result).map(function (method){
            return { 
                name : method,
                func : (function(method){ return function (){
                    var params = Array.prototype.slice.call(arguments),
                        cb = params.length
                            && typeof params[params.length-1] === "function"
                            && params.pop();
                    return self.callRpc(method, params, cb);
                }})(method)
            };
        }).reduce(function(memo, remoteFunc){
            assign(memo, remoteFunc.name.split('.'), remoteFunc.func);
            return memo;
        },self);
        self.emit('ready', self);
        if(callback){
            callback(err, self);
        }
    });
};
