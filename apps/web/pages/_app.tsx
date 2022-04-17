
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import {createTodoHandlers} from 'mock-api';

const todoHandler = createTodoHandlers({
  baseUrl: '/api'
});

if (typeof window === 'undefined') {
  import('msw/node').then((module) => {
    const server = module.setupServer(...todoHandler);
    server.listen();
  });
} else {
  import('msw').then((module) => {
    const worker = module.setupWorker(...todoHandler);
    worker.start();
  });
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}