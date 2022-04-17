type EntityId = string;

export default class Database<Props extends Record<string, any>> {
  constructor(
    private json: Map<EntityId, Props>,
  ) {}

  findOne(id: EntityId): Props | null {
    return this.json.get(id) || null;
  }

  findMany(query: (entity: Props) => boolean): Props[] | [] {
    return Array.from(this.json.values())
      .filter((item) => query(item))
  }

  updateOne(query: {
    id: EntityId,
    changes: Partial<Props>
  }): void | Error {
    const item = this.findOne(query.id);
    if (item) {
      Object.assign(item, query.changes);
      return;
    } else {
      return new Error(`no entity found witn id ${query.id}`);
    }
  }

  addOne(props: Props & {id: string}) {
    const item = this.findOne(props.id);

    if (item) {
      return new Error(`entity with id ${props.id} already exists`);
    }

    this.json.set(props.id, props);

    return;
  }

  removeOne(id: EntityId) {
    const item = this.findOne(id);

    if (item) {
      this.json.delete(id);
      return null;
    } else {
      return new Error('no entity with id has been found');
    }
  }
}