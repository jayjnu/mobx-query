import { makeAutoObservable} from 'mobx';

export type QueryExpression<T> = () => T;

export default class QueryKey<T> {
  constructor(readonly name: string, private expression: QueryExpression<T>) {
    makeAutoObservable(this);
  }

  get value() {
    return this.expression();
  }

  get cacheKey() {
    return `${JSON.stringify(this.value)}@${this.name}`;
  }
}
