import {Query, CacheController} from '@jayjnu/mobx-query';

export type Todo = {
  title: string;
  id: number;
}

export default class TodoService {
  constructor(private cacheController: CacheController) {}
  getTodos() {
    return new Query<Todo[], void>(this.cacheController, {
      name: 'todos',
      fetch: () => Promise.resolve([
        {
          title: 'hello',
          id: 1
        },
        {
          title: 'what',
          id: 2
        }
      ]),
      queryKey: [],
      initialData: []
    })
  }
}