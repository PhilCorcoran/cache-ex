var NodeCache= require('node-cache');
module.exports=CEX;

function CEX(options){
	if (!(this instanceof CEX)) return new CEX(options);
	if (!options.secret) throw new Error('No secret supplied for cache admin');
	this.cache= new NodeCache();
	this.secret=options.secret;
	this.aTimeToLive=aTimeToLive=options.timeToLive || 0;
	this.put=function(data,req){
		this.cache.set(getKey(req),data,this.aTimeToLive);
	}
};

CEX.prototype.serve = function(){
	var self=this;
	return function(req,res,next){
		if(req.method !=="GET" || req.query.hasOwnProperty("nocache")){
			return next();
		}
		var key=getKey(req);
		self.cache.get(key,function(err,value){
			if(!isEmpty(value)){
				res.locals.data=value[key];
				if(!res.get('Content-Type')){
					res.header('Content-Type','application/json');
				}
				return res.send(res.locals.data);
			}
			next();
		});
	}
}
CEX.prototype.admin=function(){
	var self=this;
	return function(req,res,next){
		switch(req.path){
			case "/stats":
			res.send(self.cache.getStats());
			break;
			case "/keys":
			res.send(Object.keys(self.cache.data));
			break;
			case "/flush":
			if(req.method=='GET'){
				var form='<html><form action="' +req.originalUrl+'" method="POST"><input name="secret" placeholder="secret word"></input><button type="submit">flush</button></form></html>'
				res.send(form);
				break;
			}
			if(req.method!="POST"){
				res.status(401).send("Not available");
				break;
			}
			if(!req.body.secret || self.secret !==req.body.secret){
				res.status(401).send("Unauthorized");
				break;
			}else{
				self.cache.flushAll();
				res.send({flushed:"OK"});
			}
			break;
			default:
			res.send('no matching url');
			break;
		}
	};
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
