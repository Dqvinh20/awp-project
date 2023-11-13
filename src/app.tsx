import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import jwtService from './services/JwtService';

// Create a client
const queryClient = new QueryClient();
const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjU0Y2I2ODg1NzZhYjRiNjdkMGZjMGZiIiwiaWF0IjoxNjk5ODg4MjUyLCJleHAiOjE2OTk4OTE4NTJ9.Uols2Yc8jEEJsdHpTgRT3s3yh86q1PDoIYNkY2V9Ix16dcqfKk9EzieYFp8PO34dMBnJ7H6N-CVnvLedBuL9KfxyO7mz3XEShI0FCVs5_qmmJDyw7dpUT0-43UEJQfOpsH_u7ze-GurEIwE5POlOhkjgZLYWY5uW5Brxgj2tu5DXQgX8S0Z3PIgtIOxiCujc-B8k8l1QQfy_1tlYIWJoKFUQd_tloIydxZkyxZgP7y84xBcVshNOtcy7nCHh45ykOQKpD7phufS6s20lvbw_bTmyS_Fs1n7d1zWUf1YPDLtHOIlfUwhyhjOeg08sWpIc0WYUDhZckYmeuT2u2CKfnA"
function App() {
  jwtService.saveToken(token);
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
