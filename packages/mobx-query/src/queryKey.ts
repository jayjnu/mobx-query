import QueryKey, {QueryExpression} from './lib/QueryKey';

export default function queryKey<T extends Record<string, unknown>>(name: string, expression: QueryExpression<T>) {
  return new QueryKey<T>(name, expression);
}