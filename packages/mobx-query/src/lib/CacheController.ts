import { makeAutoObservable } from 'mobx';
import Cache from './Cache';

interface CacheControllerEvents {
  onInvalidate: (key: string) => void;
}

export default class CacheController {
  constructor(private cache: Cache, private events: CacheControllerEvents) {
    makeAutoObservable(this);
  }

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

  refetch<T>(cachKey: string, fetch: () => Promise<T>) {
    console.log('refetch', cachKey);
    this.clearCache(cachKey);

    return this.hitOrMiss(cachKey, fetch);
  }

  invalidateCache(cacheKey: string) {
    this.clearCache(cacheKey);
    this.events.onInvalidate(cacheKey);
  }

  invalidateCacheByTags(tags: string[]) {
    tags.forEach((tag) => {
      this.cache.purgeMany(([cacheKey]) => cacheKey.endsWith(`@${tag}`));
      this.events.onInvalidate(tag);
    });
  }
}
