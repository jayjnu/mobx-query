import {QueryClient} from "@jayjnu/mobx-query";
import {observer} from "mobx-react-lite";
import TodoService from "../libs/domain/services/TodoService";
import TodoStore from "../libs/domain/stores/TodoStore";

const queryClient = new QueryClient();

const store = new TodoStore(new TodoService(queryClient));

export default observer(function Web() {
  return (
    <div>
      <h1>Web</h1>
      {store.todos.isLoading && 'loading....'}
      {store.todos.data.map((value) => {
        return <div>{value.title}</div>
      })}
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
