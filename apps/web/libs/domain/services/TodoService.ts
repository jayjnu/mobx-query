import {QueryKey, QueryClient} from '@jayjnu/mobx-query';

export type Todo = {
  title: string;
  id: number;
}

export type AddTodoForm = {
  title: string;
}
export default class TodoService {
  constructor(private queryClient: QueryClient) {}

  getTodos(key: QueryKey<number>) {
    return this.queryClient.createQuery<{data: Todo[]}, number>( {
      name: 'todos',
      fetch: async ({queryKey}) => {
        const [page] = queryKey;
        const res = await fetch(`/api/todos?page=${page}`, {
          method: 'get'
        });
        const json = await res.json();

        return json;
      },
      queryKey: [key],
      initialData: {data: []}
    });
  }

  addTodo() {
    return this.queryClient.createMutation<AddTodoForm, void>({
      fetch: async (data) => {
        const res = await fetch('/api/todo', {
          method: 'post',
          body: JSON.stringify(data)
        });

        if (res.status >= 400) {
          throw await res.json();
        }
      },
      onError: (err) => {
        console.log(err);
      },
      invalidateTags: ['todos']
    });
  }
}