import { makeAutoObservable } from 'mobx';
import {queryKey} from "@jayjnu/mobx-query";
import TodoService from "../services/TodoService";

export default class TodoStore {
  page = 1;
  private todosQueryKey = queryKey('todos', () => this.page);
  todos = this.service.getTodos(this.todosQueryKey);

  constructor(private service: TodoService) {
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.page = page;
  }
}