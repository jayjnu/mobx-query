import {makeAutoObservable, observable} from "mobx";
import Hit from "./Hit";

export default class Cache {
  private data = observable.map<string, Hit>();

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
}