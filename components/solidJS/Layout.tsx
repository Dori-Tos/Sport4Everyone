import {
  Show,
  Suspense,
  JSXElement,
  createSignal,
  createEffect,
  Switch,
  Match,
} from "solid-js";
import { createAsync } from "@solidjs/router";
import { getUser } from "~/lib/users";
import Nav from "./Nav";
import AuthPopup from "./AuthPopup";

export default function Layout(props: {
  children: JSXElement;
  protected?: boolean;
}) {
  const user = createAsync(() => getUser());

  return (
    <Show when={props.protected} fallback={props.children}>
      <Switch fallback={<AuthPopup />}>
        <Match when={user()}>
          <div>
            <Nav />
            {props.children}
          </div>
        </Match>
        <Match when={user() === undefined}>
          <div class="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600 mb-4"></div>
              <p class="text-gray-700">Loading...</p>
            </div>
          </div>
        </Match>
      </Switch>
    </Show>
  );
}
