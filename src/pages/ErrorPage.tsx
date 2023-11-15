import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import NotFoundPage from './404';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center flex-row items-center">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <h2 className="twp font-black text-gray-200 text-9xl m-4">
            {error.status}
          </h2>
          <p className="twp mt-4 text-gray-500">{error.statusText}</p>
          {error.data?.message && <p>{error.data.message}</p>}
          <a
            href="/home"
            className="twp inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return <div>Sorry, an unexpected error has occurred.</div>;
}
