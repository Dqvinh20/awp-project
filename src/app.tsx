import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

import NetworkStatus from './components/NetworkStatus';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      // 10s
      staleTime: 10 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: '"Open Sans", "Inter", Roboto, sans-serif',
          },
        }}
      >
        <AntApp notification={{ placement: 'topRight' }}>
          <Outlet />
          <NetworkStatus />
        </AntApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
