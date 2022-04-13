import {reaction, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, IReactionDisposer} from "mobx";
import CacheController from "./CacheController";
import QueryStatus from "./QueryStatus";
import QueryKey from "./QueryKey";
import QueryKeysMapper from "./QueryKeysMapper";
import QueryStatusController from "./QueryStatusController";

interface QueryContext<T> {
  signal?: any;
  queryKey: T[];
}


export interface QueryDescriptor<Data, QueryKeyValue> {
  name: string;
  fetch: (ctx: QueryContext<QueryKeyValue>) => Promise<Data>;
  queryKey: QueryKey<QueryKeyValue>[];
  initialData: Data;
}

export default class Query<Data, Params> {
  data: Data = this.queryDescriptor.initialData;
  private status = new QueryStatus()
  private statusController = new QueryStatusController(this.status);
  private fetchReactionDisposer: IReactionDisposer | null = null;
  private queryKeysMapper = QueryKeysMapper.of(this.queryDescriptor.queryKey);

  get isLoading() {
    return this.status.isLoading;
  }

  get isError() {
    return this.status.isError;
  }
  get isSuccess() {
    return this.status.isSuccess;
  }

  get isUninitialized() {
    return this.status.isUninitialized;
  }

  constructor(
    private cacheController: CacheController,
    private queryDescriptor: QueryDescriptor<Data, Params>
  ) {
    makeAutoObservable(this);
    onBecomeObserved(this, 'data', this.init);
    onBecomeUnobserved(this, 'data', this.destroy);
  }

  private init = () => {
    this.fetchReactionDisposer = reaction(() => {
      return {
        cacheKey: this.queryKeysMapper.toCacheKey(),
        values: this.queryKeysMapper.toValues()
      };
    }, ({cacheKey, values}) => {
      this.request(cacheKey, values);
    }, {
      fireImmediately: true
    })
  }

  private setData(data: Data) {
    this.data = data;
  }

  private destroy = () => {
    this.fetchReactionDisposer?.();
    this.fetchReactionDisposer = null;
  }

  private request(cacheKey: string, values: Params[]) {
    this.cacheController.hitOrMiss<Data>(cacheKey, () => {
      return this.statusController.run(() => {
        return this.queryDescriptor.fetch({queryKey: values});
      });
    }).then((hit) => {
      if (hit?.data) {
        this.setData(hit.data);
      }
    });
  }

  invalidate() {
    const cacheKey = this.queryKeysMapper.toCacheKey();
    const values = this.queryKeysMapper.toValues();

    this.cacheController.clearCache(cacheKey);
    this.request(cacheKey, values);
  }
}
