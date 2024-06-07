import { FunctionComponent } from "react";

import { DROPBOX_APP } from "../system/dropbox/dropboxCommon";
import { SYSTEM_NAME } from "../system/authentication";

import { DropboxSystem } from "../system/dropbox/dropboxSystem";

import { FaDropbox } from "react-icons/fa";

import "./css/logInView.css";

type Props = {
  isLogInDisabled: boolean;
};

export const LogInView: FunctionComponent<Props> = ({ isLogInDisabled }) => {
  function DropboxLogIn() {
    window.localStorage.setItem(SYSTEM_NAME, DROPBOX_APP);
    const dropbox = new DropboxSystem();
    dropbox.auth.RequestLogin();
  }

  return (
    <div className={isLogInDisabled ? "login-container-disabled" : ""}>
      <div
        className="login-button"
        onClick={isLogInDisabled ? () => {} : DropboxLogIn}
      >
        <span>
          <FaDropbox />
        </span>
        <span className="login-text">Dropbox</span>
      </div>
    </div>
  );
};
