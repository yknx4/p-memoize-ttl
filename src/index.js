const CacheMap = require('cache-map').default;
const Promise = require('bluebird');

const memoizePromise = (fn, options) => {
    const cacheMap = new CacheMap(options.ttl, options.evictInterval);
    const memoizedPromise = (...args) => {
        const cacheKey = args.length ? args.join('__') : '____';
        const cachedResult = cacheMap.get(cacheKey);
        if (cachedResult) {
            return Promise.resolve(cachedResult);
        }
        return fn(...args)
            .then((result) => {
                cacheMap.set(cacheKey, result);
                return result;
            });
    };
    return memoizedPromise;
};

module.exports = memoizePromise;
