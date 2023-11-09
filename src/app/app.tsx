/* eslint-disable @nx/enforce-module-boundaries */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NxWelcome from './nx-welcome';

// Create a client
const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <NxWelcome title="awp-project-fe" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
