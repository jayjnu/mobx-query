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
  rest.post<string>(`${baseUrl}/todo`, (req, res, ctx) => {
    const props = JSON.parse(req.body) as TodoEntityProps;

    if (!props) {
      return res(
        ctx.status(400),
      )
    }

    const entity = new TodoEntity(props);
    const validation = entity.validate();

    if (validation === true) {
      const result = db.addOne(entity.serialize());

      if (result) {
        return res(ctx.status(400), ctx.json({
          messages: result.message
        }));
      } else {
        return res(
          ctx.status(201),
        );
      }
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          messages: validation.map((error) => error.message)
        })
      )
    }

  }),
  // Handles a GET /user request
  rest.get(`${baseUrl}/todos`, (req, res, ctx) => {
    const data = db.findMany(() => true);

    return res(ctx.status(200), ctx.json({data}));
  }),
])