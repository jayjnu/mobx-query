import { makeAutoObservable } from 'mobx';
import {queryKey} from "@jayjnu/mobx-query";
import TodoService from "../services/TodoService";

export default class TodoStore {
  page = 1;
  private todosQueryKey = queryKey('todos', () => this.page);

  private todosQuery = this.service.getTodos(this.todosQueryKey);

  get todos() {
    return this.todosQuery.data;
  }


  constructor(private service: TodoService) {
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.page = page;
  }
}