import TodoService from "../services/TodoService";

export default class TodoStore {
  todos = this.service.getTodos();

  constructor(private service: TodoService) {}
}