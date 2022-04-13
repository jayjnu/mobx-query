import CacheController from './lib/CacheController';
import Cache from './lib/Cache';
import Query, {QueryDescriptor} from './lib/Query';

export default class QueryClient {
  private cache = new Cache();
  private controller = new CacheController(this.cache);

  createQuery<Data, Keys>(descriptor: QueryDescriptor<Data, Keys>) {
    return new Query<Data, Keys>(this.controller, descriptor);
  }
}