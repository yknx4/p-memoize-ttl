const CacheMap = require('cache-map').default
const _promise = require('bluebird')
const safeStringify = require('fast-safe-stringify')
const debug = require('debug')('memoize-p')

const PromiseLib = Promise === undefined ? _promise : Promise

const memoizePromise = (fn, options) => {
  const cacheMap = new CacheMap(options.ttl, options.evictInterval)
  const memoizedPromise = (...args) => {
    const cacheKey = safeStringify(args);
    const cachedResult = cacheMap.get(cacheKey);
    if (cachedResult) {
      debug('hit with ' + cacheKey);
      return PromiseLib.resolve(cachedResult)
    }
    return fn(...args).then(result => {
      cacheMap.set(cacheKey, result)
      return result
    })
  }
  return memoizedPromise
}

module.exports = memoizePromise
