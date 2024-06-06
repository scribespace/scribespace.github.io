import { useState, useEffect } from "react";

import {
  authGlobal,
  AUTH_DISABLED,
  AUTH_LOGIN,
  AUTH_LOGOUT,
} from "../system/authentication";

import { MainView } from "./mainView";
import { LogInView } from "./logInView";

export function WelcomeView() {
  const [authButtonState, setAuthButtonState] = useState(AUTH_DISABLED);

  useEffect(() => {
    if (authButtonState === AUTH_DISABLED) {
      authGlobal.tryAuthentication().then((loggedIn) => {
        setAuthButtonState(loggedIn ? AUTH_LOGOUT : AUTH_LOGIN);
      });
    }
  }, [authButtonState]);

  function Content() {
    if (authButtonState === AUTH_LOGOUT) {
      return <MainView changeAuthButtonState={setAuthButtonState} />;
    }
    return <LogInView isLogInDisabled={authButtonState == AUTH_DISABLED} />;
  }

  return <Content />;
}
