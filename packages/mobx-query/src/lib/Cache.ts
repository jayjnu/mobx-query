import {makeAutoObservable, observable, entries} from "mobx";
import Hit from "./Hit";

type CacheKey = string;

type PurgeStats = {
  ids: CacheKey[];
}
export default class Cache {
  private data = observable.map<CacheKey, Hit>();

  constructor() {
    makeAutoObservable(this);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  get<T>(key: string): Hit<T> | undefined {
    return this.data.get(key);
  }

  set<T>(key: string, data: T) {
    this.data.set(key, new Hit(data));
  }

  purge(key: string) {
    this.data.delete(key);
  }

  purgeMany(predicate: (arg: [CacheKey, Hit]) => boolean): PurgeStats {
    const stats: PurgeStats = {
      ids: []
    };
    entries(this.data).forEach(([key, value]) => {
      if (predicate([key, value])) {
        console.log('purge', key);
        stats.ids.push(key);
        this.purge(key);
      }
    })
    return stats;
  }
}