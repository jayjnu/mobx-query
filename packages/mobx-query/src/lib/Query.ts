import {reaction, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, IReactionDisposer} from "mobx";
import CacheController from "./CacheController";
import QueryStatus from "./QueryStatus";
import QueryKey from "./QueryKey";
import QueryKeysMapper from "./QueryKeysMapper";
import QueryStatusController from "./QueryStatusController";
import Hit from "./Hit";

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
  error: null | Error | unknown = null;
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

  private get cacheKeyPairs() {
    return {
      cacheKey: this.queryKeysMapper.toCacheKey(),
      values: this.queryKeysMapper.toValues()
    };
  }

  private init = () => {
    this.fetchReactionDisposer = reaction(() => {
      return this.cacheKeyPairs;
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

  private async request(cacheKey: string, values: Params[]) {
    const hit = await this.cacheController.hitOrMiss<Data>(cacheKey, () => this.fetch(values));

    this.onCachedResultSuccess(hit);
  }

  private onCachedResultSuccess(hit?: Hit<Data>) {
    if (hit?.data) {
      this.setData(hit.data);
    }
  }

  private fetch(params: Params[]) {
    return this.statusController.run(() => this.queryDescriptor.fetch({queryKey: params}));
  }

  async refetch() {
    const {cacheKey, values} = this.cacheKeyPairs;
    const hits = await this.cacheController.refetch(cacheKey, () => this.fetch(values));

    this.onCachedResultSuccess(hits);
  }
}
