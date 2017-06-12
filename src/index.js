const CacheMap = require('cache-map').default
const _promise = require('bluebird')
const safeStringify = require('fast-safe-stringify')
const debug = require('debug')('memoizep')
const crypto = require('crypto')

const PromiseLib = Promise === undefined ? _promise : Promise

function cacheKeyfn(...args) {
  return crypto.createHash('md5').update(safeStringify(args)).digest('hex')
}

const memoizePromise = (fn, options, keyFn = cacheKeyfn) => {
  const cacheMap = new CacheMap(options.ttl, options.evictInterval)
  const memoizedPromise = (...args) => {
    const cacheKey = keyFn(...args);
    debug(cacheKey)
    const cachedResult = cacheMap.get(cacheKey)
    if (cachedResult) {
      debug('hit with ' + cacheKey)
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
