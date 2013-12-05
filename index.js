var NodeCache= require('node-cache');
var cache, aTimeToLive, aSecret;

function get(req,res,next){
	if(req.method !=="GET" || req.query.hasOwnProperty("nocache")){
		return next();
	}
	var key=getKey(req);
	if(cache===undefined){
		throw Error("init() was not called to setup cache");
	}	
	cache.get(key,function(err,value){
		if(!isEmpty(value)){
			res.locals.data=value[key];
		}
		next();
	});
};

function admin(req,res,next){
	switch(req.path){
		case "/stats":
		res.send(cache.getStats());
		break;
		case "/keys":
		res.send(Object.keys(cache.data));
		break;
		case "/flush":
		if(req.method!="POST"){
			res.status(401).send("Not available");
			break;
		}
		if(!req.body.secret || aSecret !==req.body.secret){
			res.status(401).send("Unauthorized");
			break;
		}else{
			cache.flushAll();
			res.send({flushed:"OK"});
		}
		break;
		default:
		res.send('no matching cache url');
		break;
	}
};

function init(secret,timeToLive){
	cache= new NodeCache();
	aSecret=secret;
	aTimeToLive=timeToLive!==undefined?timeToLive:0;
};

function put(data,req){
	if(cache===undefined){
		throw Error("init() was not called to setup cache");
	}
	cache.set(getKey(req),data,aTimeToLive);
}


function isEmpty(obj) {
	return Object.keys(obj).length === 0;
};

function getKey(req){
	var keys=[];
	for (var key in req.query) {
		if (req.query.hasOwnProperty(key) && key.toUpperCase() !=="NOCACHE") {
			keys.push(key);
		}
	}
	keys=keys.sort();
	var cacheKey=req.path+"|";
	for(var i=0;i<keys.length;i++){
		cacheKey=cacheKey+keys[i]+":"+req.query[keys[i]]+"|";
	}
	return cacheKey;
};
exports.get=get;
exports.admin=admin;
exports.init=init;
exports.put=put;
