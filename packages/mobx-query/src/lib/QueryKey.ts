export default class QueryKey<T = any> {
  constructor(readonly key: string, public value: T) {}

  serialize(): string {
    return `${this.key}:${this.value}`;
  }
}