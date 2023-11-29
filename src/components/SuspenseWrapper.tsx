import { Spin } from 'antd';
import { Suspense, lazy } from 'react';

interface SuspenseWrapperProps {
  path: string;
}

function SuspenseWrapper(props: SuspenseWrapperProps) {
  const LazyComponent = lazy(() => import(`../${props.path}`));
  return (
    <Suspense fallback={<Spin fullscreen />}>
      <LazyComponent />
    </Suspense>
  );
}

export default SuspenseWrapper;
