import {reaction, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, IReactionDisposer} from "mobx";
import CacheController from "./CacheController";
import QueryKey from "./QueryKey";
import QueryKeysMapper from "./QueryKeysMapper";
import QueryStatus from "./QueryStatus";
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

export default class Query<Data, Params> extends QueryStatus {
  data: Data = this.queryDescriptor.initialData;
  private statusController = new QueryStatusController(this);

  private fetchReactionDisposer: IReactionDisposer | null = null;
  private queryKeysMapper = QueryKeysMapper.of(this.queryDescriptor.queryKey);

  constructor(
    private cacheController: CacheController,
    private queryDescriptor: QueryDescriptor<Data, Params>
  ) {
    super();
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
      this.cacheController.hitOrMiss(cacheKey, () => {
        return this.statusController.run(() => {
          return this.queryDescriptor.fetch({queryKey: values});
        });
      });
    }, {
      fireImmediately: true
    })
  }

  private destroy = () => {
    this.fetchReactionDisposer?.();
    this.fetchReactionDisposer = null;
  }
}
