import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AntApp>
          <Outlet />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
