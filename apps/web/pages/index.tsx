import {QueryClient} from "@jayjnu/mobx-query";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import TodoService from "../libs/domain/services/TodoService";
import TodoStore from "../libs/domain/stores/TodoStore";
import Todo from "../libs/features/todo/Todo";
import TodoList from "../libs/features/todo/TodoList";
import {TodoProvider} from "../libs/features/todo/TodoProvider";

const queryClient = new QueryClient();

const store = new TodoStore(new TodoService(queryClient));

export default observer(function Web() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h1>Web</h1>
      <TodoProvider store={store}>
        <Todo/>
      </TodoProvider>
      <div className="todos-console">
        <form onSubmit={(evt) => {
          evt.preventDefault();
          const value = inputRef.current?.value || '';

          if (!value) {
            return;
          }

          store.addTodo({
            title: value
          })
        }}>
          <label>
            add todo:
            <input type="text" ref={inputRef}/>
          </label>
          <button type="submit">add</button>
        </form>
      </div>
      <div>
        {store.addTodosMutationErrors && <button type="button">에러 발생</button>}
        {store.addTodosMutationErrors?.map((message, i) => {
          return <strong key={i}>{message}</strong>
        })}
      </div>
      <div>{store.isLoading && 'loading....'}</div>
      <div>
        <strong>{store.page}</strong>
        <button onClick={() => store.setPage(store.page - 1)} disabled={store.page < 2}>prev</button>
        <button onClick={() => store.setPage(store.page + 1)}>next</button>
      </div>
      <div>
        <button onClick={() => queryClient.invalidateCache('todos')}>
          invalidate
        </button>
      </div>
    </div>
  );
})
