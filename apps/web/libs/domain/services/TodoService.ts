import {QueryKey, QueryClient} from '@jayjnu/mobx-query';

export type Todo = {
  title: string;
  id: number;
}

export default class TodoService {
  constructor(private queryClient: QueryClient) {}
  getTodos(key: QueryKey<number>) {
    return this.queryClient.createQuery<{data: Todo[]}, number>( {
      name: 'todos',
      fetch: () => {
        return fetch('/api/todos').then((res) => res.json())
      },
      queryKey: [key],
      initialData: {data: []}
    });
  }

  addTodo() {
    return this.queryClient.createMutation({

    });
  }
}