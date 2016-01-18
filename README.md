cache-ex
===========

Caches all responses to HTTP GET requests in memory using `node-cache`. 
Provides admin urls to manage the cache

# Install

```bash
  npm install cache-ex
```


# Examples:

## Initialization

```js
var cacheEx=require('cache-ex')({secret:'dont tell a soul'});
```

### Options
secret,timeToLive
- `timeToLive`: the standard ttl as number in seconds for every generated cache element. Default = 0 = unlimited
- `secret`: A secret word to protect flusing of the cache
= `cacheControlMaxAge`: HTTP Cache-Control header will be sent with this max-age if set and > 0 when serving content from the cache.

## Retrieve and Serve cached data:

Relies on  `expressjs`.
The following code instructs `express` to use the `serve` method of `cache-ex` on all requests. Subsequent handlers are only called if the object has not been served from the cache.
```js
app.use(cacheEx.serve());

app.get('/any',function(req,res){
	cacheEx.put({object:'Cached Object',req:req.query},req);
	res.send({status:'Not from cache',req:req.query});
});

Or add and send in one fn call. This ensures any cache control headers configured are sent the same from first and subsequent calls.

app.get('/any',function(req,res){
	cacheEx.putAndServe({object:'Cached Object',req:req.query},req, res);
});

```
`cache-ex` does not cache POST requests only GET.

##Manage the cache
The admin urls for managing the cache are available after the `/cache` root in this example.

```js
  app.use('/cache',cacheEx.admin());
```

###Cache Keys :
Are automatically created based on the url path and the query string.
Query parameters are sorted before key generation so that the order of parameters in the request is unimportant.

###Store data :

```js
cacheEx.put(data,req);
```
Puts a new value into the cache.


###View the cache keys

HTTP get to `/cache/keys`

###View the cache statistics
HTTP get to `/cache/stats`
Includes the number of hits and misses

###Flush the cache
HTTP POST to '/cache/flush' with the following json to match the `secret` configured during initialization.
```json 
{"secret":"mySecret"}
```

#Test
Install the required node modules and run `test/app.js`
```bash
npm install
node test.js
```

Browse to the following urls

`http://localhost:8080/any?product=22&catalog=music`

`http://localhost:8080/any?catalog=music&product=22`

Notice that the order of query parameters does not matter


`http://localhost:8080/any?catalog=music&product=33&nocache`

Adding the `nocache` parameter retrives a new value every time. This enables you to refresh the value of a single key

Check out the admin urls
`http://localhost:8080/cache/keys`
```json[
"/any|catalog:music|product:22|"
"/any|catalog:music|product:33|"
]
```
`http://localhost:8080/cache/stats`
```json
{
"hits": "2",
"misses": "3",
"keys": "2",
"ksize": "64",
"vsize": "160"
}
```
Flush the cache
POST to `http://localhost:8080/cache/flush` with `{"secret":"mySecret"}`

Returns a HTTP Status 200 with the following json

```json
{
"flushed": "OK"
}	
```
## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|v0.3.2|2014-06-17|Bug fix|
|v0.3.2|2014-06-17|Simple HTML form to flush the cache|
|v0.3.1|2014-05-13|Added serve method. Multiple caches can be required and used in the same service|
|v0.2.1|2013-12-05|Added sorting of query parameters|

# License 

(The MIT License)

Copyright (c) 2013 PC 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
