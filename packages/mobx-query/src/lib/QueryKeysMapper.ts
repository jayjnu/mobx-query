import QueryKey from "./QueryKey";

export default class QueryKeysMapper {
  private constructor(private keys: QueryKey[]) {}

  toCacheKey() {
    return this.keys.map((value) => value.serialize()).join('&');
  }

  toValues() {
    return this.keys.map((key) => key.value);
  }

  static of(keys: QueryKey[]) {
    return new QueryKeysMapper(keys);
  }
}