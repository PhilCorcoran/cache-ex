cache-ex
===========

Caches all responses to HTTP GET requests in memory using `node-cache`. 
Provides admin urls to manage the cache

# Install

```bash
  npm install cache-ex
```

Or just require the `cache-ex.js` file to get the superclass

# Examples:

## Initialize (INIT):

```js
var cacheEx=require('cache-ex');
cacheEx.init("mySecretWord",3600);
```

### Options
secret,timeToLive
- `timeToLive`: the standard ttl as number in seconds for every generated cache element. Default = 0 = unlimited
- `secret`: A secret word to protect flusing of the cache


## Retrieve data:

Relies on  `expressjs`.
The following code instructs `express` to use the `get` method of `cache-ex` on all requests.
`cache-ex` does not cache POST requests only GET.

##Manage the cache
The admin urls for managing the cache are available after the `/cache` root in this example.

```js
  app.use('/cache',cacheEx.admin);
  app.use(cacheEx.get);
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
HTTP POST to '/cache/flush' with the following json to match the `secret` configured in `init`
```json 
{"secret":"mySecret"}
```

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
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
