import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

import jwtService from './services/JwtService';

// Create a client
const queryClient = new QueryClient();
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjU0NWRjMGFlNjViNmM4YTViZDcxYjgyIiwiaWF0IjoxNjk5OTM5Mjc5LCJleHAiOjE2OTk5NDI4Nzl9.KQv1hMuXOdgGzT1N_Us4m6NGTajGtCTztNC5gndybP69WeWS8l8xwl0ufcts_U5B4HNtnPEMoCNGs9Bd3sY7eqo75wegwhr7W7FYYDkLTAFxQ1ZrGzbqQrlwte-jCCsP4v656woTwdE821TIAUdhRNoQftJubyq53YinzWgLpi6lq0O8MBbV51Z0U7Tep6d6_gv-2L-1bPiq7PQYh14BYrg-ZDg66rSpHC7CkDIHnYmqfQw1b415wRYoyeU-MU-Isj7BUAZhR0Fo5-wkAmJ4uhQ_3WcH-Edf0RlS-Wnfye9MVfPZXp7gyH2rO_KIjHhWnkk2xCIiAQQIVBpq1c6L9g';
function App() {
  jwtService.saveToken(token);
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
