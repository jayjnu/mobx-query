import QueryKey from "./QueryKey";

export default class QueryKeysMapper<T> {
  private constructor(private keys: QueryKey<T>[]) {}

  toCacheKey() {
    return this.keys.map((key) => key.cacheKey).join('&');
  }

  toValues() {
    return this.keys.map((key) => key.value);
  }

  static of<T>(keys: QueryKey<T>[]) {
    return new QueryKeysMapper<T>(keys);
  }
}