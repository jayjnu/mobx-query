import { makeAutoObservable } from 'mobx';
import CacheController from './CacheController';
import QueryStatus from "./QueryStatus";
import QueryStatusController from "./QueryStatusController";

export interface MutationDescriptor<T, P> {
  fetch: (params: T) => Promise<P>;
  onError?: (err: unknown) => void;
  invalidateTags: string[];
}

export default class Mutation<Params, Response> {
  private status = new QueryStatus();
  private statusController = new QueryStatusController(this.status);

  error: unknown | Error | null = null;

  constructor(
    private cacheController: CacheController,
    private descriptor: MutationDescriptor<Params, Response>
  ) {
    makeAutoObservable(this);
  }

  get isLoading() {
    return this.status.isLoading;
  }

  get isSuccess() {
    return this.status.isSuccess;
  }

  get isUninitialized() {
    return this.status.isUninitialized;
  }

  get isError() {
    return this.status.isError;
  }

  mutate(params: Params) {
    this.error = null;
    this.statusController.run(() => this.descriptor.fetch(params)).then(() => {
      this.cacheController.invalidateCacheByTags(this.descriptor.invalidateTags);
    }).catch(this.handleError.bind(this));
  }

  private handleError(err: unknown) {
      this.error = err;
      this.descriptor.onError?.(err);
  }
}