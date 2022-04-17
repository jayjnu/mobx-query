import { rest } from 'msw';
import Database from '../helpers/Database';
import data from './data/data';
import TodoEntity, {TodoEntityProps} from './data/Todo';

type TodoHandlersInit = {
  baseUrl: string
}

const db = new Database(data);

export const createHandlers = ({
  baseUrl
}: TodoHandlersInit) => ([
  // Handles a POST /login request
  rest.post<TodoEntityProps>(`${baseUrl}/todo`, (req, res, ctx) => {
    const props = req.body;

    if (!props) {
      return res(
        ctx.status(400),
      )
    }

    const entity = new TodoEntity(props);
    const validation = entity.validate();

    if (validation === true) {
      db.addOne(entity.serialize());

      return res(
        ctx.status(201),
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          messages: validation
        })
      )
    }

  }),
  // Handles a GET /user request
  rest.get(`${baseUrl}/todos`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({data: db.findMany(() => true)}));
  }),
])