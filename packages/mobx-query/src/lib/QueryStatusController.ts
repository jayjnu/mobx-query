import QueryStatus from "./QueryStatus";

export default class QueryStatusController {
  constructor(private status: QueryStatus) {}

  async run<T>(fn: () => Promise<T>) {
    this.status.load();

    try {
      const res = await fn()

      this.status.success();

      return res;
    } catch(err) {
      this.status.error();
      throw err;
    }
  }
}