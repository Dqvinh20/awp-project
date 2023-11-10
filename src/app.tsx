import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <Outlet />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
