import CacheController from './lib/CacheController';
import Cache from './lib/Cache';
import Query, {QueryDescriptor} from './lib/Query';
import QueryKey from './lib/QueryKey';
import Mutation, {MutationDescriptor} from './lib/Mutation';

export default class QueryClient {
  private cache = new Cache();
  private controller = new CacheController(this.cache, {
    onInvalidate: this.handleCacheInvalidation.bind(this)
  });
  private queryMap = new Map();

  createQuery<Data, Keys>(descriptor: QueryDescriptor<Data, Keys>) {
    const query = new Query<Data, Keys>(this.controller, descriptor);

    this.queryMap.set(descriptor.name, query);

    return query;
  }

  createMutation<RequestBody, Response>(descriptor: MutationDescriptor<RequestBody, Response>) {
    const mutation = new Mutation<RequestBody, Response>(this.controller, descriptor);

    return mutation;
  }

  invalidateCache(queryKey: string) {
    this.controller.invalidateCache(queryKey);
  }

  private handleCacheInvalidation(key: string) {
    console.log('handleInvalidation', key);
    
    const query = this.queryMap.get(key);

    query.refetch();
  }
}