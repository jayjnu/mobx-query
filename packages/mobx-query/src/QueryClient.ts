import CacheController from './lib/CacheController';
import Cache from './lib/Cache';
import Query, {QueryDescriptor} from './lib/Query';
import QueryKey from './lib/QueryKey';

export default class QueryClient {
  private cache = new Cache();
  private controller = new CacheController(this.cache);
  private queryMap = new Map();

  createQuery<Data, Keys>(descriptor: QueryDescriptor<Data, Keys>) {
    const query = new Query<Data, Keys>(this.controller, descriptor);

    this.queryMap.set(descriptor.name, query);

    return query;
  }

  invalidateCache(name: string) {
    const query = this.queryMap.get(name);
    

    if (query) {
      query.invalidate();
    }
  }
}