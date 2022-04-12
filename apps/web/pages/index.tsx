import {Cache, CacheController} from "@jayjnu/mobx-query";
import {observer} from "mobx-react-lite";
import TodoService from "../libs/domain/services/TodoService";
import TodoStore from "../libs/domain/stores/TodoStore";

const cacheController = new CacheController(new Cache());
const store = new TodoStore(new TodoService(cacheController));

export default observer(function Web() {
  return (
    <div>
      <h1>Web</h1>
      {store.todos.data.map((value) => {
        return <div>{value.title}</div>
      })}
    </div>
  );
})
