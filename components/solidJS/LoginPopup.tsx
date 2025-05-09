import { Show } from "solid-js"
import {  useSubmission } from "@solidjs/router"
import { loginAction } from "~/lib/auth/login"

interface LoginPopupProps {
  onSwitchToSignUp: () => void
}

export default function LoginPopup({ onSwitchToSignUp } : LoginPopupProps ) {
  const submission = useSubmission(loginAction)
  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Login Required</h2>
        
        <form method="post" action={loginAction} class="space-y-4" autocomplete="on">
          <Show when={submission.error}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submission.error}
            </div>
          </Show>
          
          <div>
            <label class="block text-gray-700 mb-2" for="email">
              Email
            </label>
            <input
              name="email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={submission.pending}
              autocomplete="username"
            />
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2" for="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={submission.pending}
              autocomplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            class="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
            disabled={submission.pending}
          >
            {submission.pending ? "Logging in..." : "Login"}
          </button>

          <div class="text-center mt-4">
            <p class="text-gray-600">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={onSwitchToSignUp} 
                class="text-blue-600 hover:underline"
                disabled={submission.pending}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}