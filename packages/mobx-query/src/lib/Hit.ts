export default class Hit<T = any> {
  createdAt = Date.now();
  constructor(public data: T) {}
}
