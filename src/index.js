const CacheMap = require('cache-map').default
const _promise = require('bluebird')
const safeStringify = require('fast-safe-stringify')
const XXHash = require('xxhash')

const PromiseLib = Promise === undefined ? _promise : Promise

const memoizePromise = (fn, options) => {
  const cacheMap = new CacheMap(options.ttl, options.evictInterval)
  const memoizedPromise = (...args) => {
    const hasher = new XXHash(0xcafebabe);
    hasher.update(safeStringify(args));
    const cacheKey = hasher.digest();
    const cachedResult = cacheMap.get(cacheKey)
    if (cachedResult) {
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
