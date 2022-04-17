import { autorun, makeAutoObservable } from 'mobx';
import {queryKey} from "@jayjnu/mobx-query";
import TodoService, {AddTodoForm} from "../services/TodoService";
export default class TodoStore {
  page = 1;
  private todosQueryKey = queryKey('todos', () => this.page);

  private todosQuery = this.service.getTodos(this.todosQueryKey);
  private addTodosMutation = this.service.addTodo();

  get todos() {
    return this.todosQuery.data.data;
  }

  get isLoading() {
    return this.todosQuery.isLoading;
  }

  get addTodosMutationErrors() {
    return (this.addTodosMutation.error as {messages?: string[]})?.messages || null
  }

  constructor(private service: TodoService) {
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.page = page;
  }

  addTodo(form: AddTodoForm) {
    this.addTodosMutation.mutate(form);
  }
}