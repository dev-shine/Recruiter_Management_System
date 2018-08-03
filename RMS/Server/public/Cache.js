var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');
// var redis = require('redis');
// var redisClient = redis.createClient({host : 'localhost', port : 6379});
//
// redisClient.on('ready',function() {
//  console.log("Redis is ready");
// });
//
// redisClient.on('error',function() {
//  console.log("Error in Redis");
// });


var redisCache = cacheManager.caching({store: redisStore, db: 0, ttl: 600});

var ttl = 5;

// listen for redis connection error event
redisCache.store.events.on('redisError', function(error) {
    // handle error here
    console.log(error);
});

module.exports = redisCache;
