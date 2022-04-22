import {QueryKey, QueryClient} from '@jayjnu/mobx-query';

export type TodoId = string;
export type TodoStatus = 'todo' | 'progress' | 'done';
export type Todo = {
  status: TodoStatus;
  title: string;
  id: TodoId;
}

export type AddTodoForm = {
  title: string;
}

export type UpdateTodoForm = {
  id: TodoId;
  changes: Partial<Omit<Todo, TodoId>>;
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

  removeTodo() {
    return this.queryClient.createMutation<string, void>({
      fetch: async (data) => {
        const res = await fetch(`/api/todos/${data}`, {
          method: 'delete',
        });

        return await res.json();
      },
      invalidateTags: ['todos']
    });
  }

  updateTodo() {
    return this.queryClient.createMutation<UpdateTodoForm, void>({
      fetch: async ({id, changes}) => {
        await fetch(`/api/todos/${id}`, {
          method: 'put',
          body: JSON.stringify({changes})
        });
      },
      invalidateTags: ['todos']
    })
  }
}