const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const Promise = require('bluebird');
const memoizePromise = require('../');

describe('TTL Memoization', () => {
    let hits = 0;
    const delay = duration => Promise.delay(duration)
        .then(() => { hits++; })
        .then(() => duration);
    it('should hit cache before it is evicted', async () => {
        const memoizedPromise = memoizePromise(delay, {
            ttl: 4000,
            evictInterval: 1000,
        });
        await memoizedPromise(3000);
        await memoizedPromise(3000);
        await memoizedPromise(1000);
        expect(hits).to.be.equals(2);
    });
    it('should evict cache after it\'s time-to-live has expired', async () => {
        const memoizedPromise = memoizePromise(delay, {
            ttl: 4000,
            evictInterval: 1000,
        });
        await memoizedPromise(3000);
        await memoizedPromise(4000);
        await memoizedPromise(3000);
        expect(hits).to.be.equals(5);
    });
});
