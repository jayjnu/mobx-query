import Cache from './Cache';

export default class CacheController {
  constructor(private cache: Cache) {}

  async hitOrMiss<T>(cacheKey: string, onMiss: () => Promise<T>) {
    if (this.cache.has(cacheKey)) {
      return this.cache.get<T>(cacheKey);
    } else {
      const res = await onMiss();

      this.cache.set(cacheKey, res);

      return this.cache.get<T>(cacheKey);
    }
  }

  clearCache(cacheKey: string) {
    this.cache.purge(cacheKey);
  }
}
