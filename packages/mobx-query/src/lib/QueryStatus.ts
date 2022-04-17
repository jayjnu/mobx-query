import {makeAutoObservable} from 'mobx';

const status = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
} as const;

type QueryStatuses = (typeof status)[keyof typeof status]

export default class QueryStatus {
  private status: QueryStatuses = status.idle;

  get isLoading() {
    return this.status === status.loading;
  }

  get isSuccess() {
    return this.status === status.success;
  }
  get isUninitialized() {
    return this.status === status.idle;
  }

  get isError() {
    return this.status === status.error;
  }

  constructor() {
    makeAutoObservable(this);
  }

  private setStatus(status: QueryStatuses) {
    this.status = status;
  }

  idle() {
    this.setStatus(status.idle);
  }

  success() {
    this.setStatus(status.success);
  }

  load() {
    this.setStatus(status.loading);
  }

  error() {
    this.setStatus(status.error);
  }
}
