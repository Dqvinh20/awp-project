import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

import jwtService from './services/JwtService';

// Create a client
const queryClient = new QueryClient();
// const token =
//   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjU0Y2I2ODg1NzZhYjRiNjdkMGZjMGZiIiwiaWF0IjoxNjk5OTY5NDk3LCJleHAiOjE2OTk5NzMwOTd9.ernkP-rrjmAJxDNisQ73vG3Hy0Vp2IWVFw84z_BwKCpoQrwe1SANtzDE5HH2ctQfktPXnJGt29J2gSzi_e128omYSAzqf6T1VAv-H46YQe2o4wYsrPzzCPZVi-jqJ3hUG2fyTvZO15GNGyuzhFDm2f8_Z2XpKqNPYtsbNOTFwwyUT_PTJHkHCxqxUn8jsioIqQ5b0wOkTvIiFpS-GfwRY4seaWh8iNVk6pCMBCaG0Wcar-Vnp3hmJ8dGCx_-bbMQjEOEROySGrvVIcG3jRQHZmm7NLBffAmUORfJFG-Kkk49pKqBWOvfPQFA_bUZeV5_PskcUn7W7ho4ABBou0keJA';
function App() {
  // jwtService.saveToken(token);
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AntApp>
          <Outlet />
        </AntApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
