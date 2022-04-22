import { TodoStatus } from './../services/TodoService';
import {makeAutoObservable } from 'mobx';
import {queryKey} from "@jayjnu/mobx-query";
import TodoService, {AddTodoForm} from "../services/TodoService";
import TodoModel from '../models/TodoModel';
export default class TodoStore {
  page = 1;
  private todosQueryKey = queryKey('todos', () => this.page);

  private todosQuery = this.service.getTodos(this.todosQueryKey);
  private addTodosMutation = this.service.addTodo();
  private removeTodoMutation = this.service.removeTodo();
  private updateTodoMutation = this.service.updateTodo();

  get todos() {
    return this.todosQuery.data.data.map((todo) => new TodoModel(todo, {
      onStatusChange: this.updateTodoStatus.bind(this),
      onRemove: this.removeTodoItem.bind(this),
      onTitleChange: this.updateTodoTitle.bind(this)
    }));
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

  private updateTodoStatus(item: TodoModel, nextStatus: TodoStatus) {
    this.updateTodoMutation.mutate({
      id: item.id,
      changes: {
        status: nextStatus
      }
    });
  }

  private removeTodoItem(item: TodoModel) {
    this.removeTodoMutation.mutate(item.id);
  }

  private updateTodoTitle(item: TodoModel, nextTitle: string) {
    if (item.title === nextTitle) {
      return;
    }
    
    this.updateTodoMutation.mutate({
      id: item.id,
      changes: {
        title: nextTitle
      }
    })
  }
}