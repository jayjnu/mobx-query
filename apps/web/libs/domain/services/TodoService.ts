import {QueryKey, QueryClient} from '@jayjnu/mobx-query';

export type Todo = {
  title: string;
  id: number;
}

const db = [
  [
    {
      title: 'hello',
      id: 1
    }
  ],
  [
    {
      title: 'what',
      id: 2
    }
  ]
]

export default class TodoService {
  constructor(private queryClient: QueryClient) {}
  getTodos(key: QueryKey<number>) {
    return this.queryClient.createQuery<Todo[], number>( {
      name: 'todos',
      fetch: () => {
        const data = db[key.value - 1];

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data || []);
          }, 1000);
        });
      },
      queryKey: [key],
      initialData: []
    });
  }
}