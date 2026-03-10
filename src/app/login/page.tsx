"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-gray-800">BDL+</span>
          <svg className="size-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>

        <h1 className="mb-2 text-center text-xl font-semibold text-gray-800">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Sign in to access the admin portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-800 py-3 font-medium text-white transition-colors hover:bg-blue-900"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
