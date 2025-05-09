import { createSignal, Show } from "solid-js"
import LoginPopup from "./LoginPopup"
import RegisterPopup from "./RegisterPopup"

export default function AuthPopup() {
  const [showLogin, setShowLogin] = createSignal(true)
  
  return (
    <>
      <Show when={showLogin()}>
        <LoginPopup 
          onSwitchToSignUp={() => setShowLogin(false)} 
        />
      </Show>
      <Show when={!showLogin()}>
        <RegisterPopup 
          onSwitchToLogin={() => setShowLogin(true)} 
        />
      </Show>
    </>
  )
}