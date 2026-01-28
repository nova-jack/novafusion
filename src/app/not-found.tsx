import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-white"
      >
        Go Home
      </Link>
    </div>
  );
}

