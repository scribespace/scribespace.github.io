import { DROPBOX_APP } from "./dropbox/dropboxCommon";
import { DropboxSystem } from "./dropbox/dropboxSystem";

import { DropboxFileSystem } from "./dropbox/fileSystem/dropboxFileSystem";
import { DropboxAuth } from "./dropbox";
import { $getAuthentication, $getFileSystem, $setSystem, $systemSet } from "@coreSystems";

export const SYSTEM_NAME = "auth_system";
const ACCESS_TOKEN = "auth_access_token";
const REFRESH_TOKEN = "auth_refresh_token";

export const AUTH_DISABLED = 0;
export const AUTH_LOGIN = 1;
export const AUTH_LOGOUT = 2;

class Authentication {
  getSystemName(): string | null {
    return window.localStorage.getItem(SYSTEM_NAME);
  }

  private getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN);
  }

  async logout(): Promise<void> {
    await $getAuthentication().logout();
    window.localStorage.removeItem(SYSTEM_NAME);
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
  }

  async tryAuthentication(): Promise<boolean> {
    const systemName = this.getSystemName();
    if (systemName) {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      if (!!accessToken && !!refreshToken) {
        switch (systemName) {
          case DROPBOX_APP:{
            if (!$systemSet())
                $setSystem( new DropboxSystem() );

              await $getAuthentication().login(accessToken, refreshToken);
              
              const dropboxFileSystem = $getFileSystem() as DropboxFileSystem;
              dropboxFileSystem.registerFileSystemWorker($getAuthentication() as DropboxAuth);
            }
            return true;
          default:
            throw Error("Unknown " + SYSTEM_NAME + ": " + systemName);
        }
      } else {
        // check if there is code in URL, user logged in
        const queryString = window.location.search; // Returns:'?q=123'// params.get('q') is the number 123
        const params = new URLSearchParams(queryString);
        const oauth_code = params.get("code");
        const state = params.get("state");
        window.history.pushState("Remove code from oauth", "ScribeSpace", "/");
        if (oauth_code) {
          switch (state) {
            case DROPBOX_APP: {
              if (!$systemSet())
                $setSystem( new DropboxSystem() );

              const tokens = await $getAuthentication().getOAuthAccessToken(oauth_code);
              window.localStorage.setItem(
                ACCESS_TOKEN,
                tokens.access_token as string
              );
              window.localStorage.setItem(
                REFRESH_TOKEN,
                tokens.refresh_token as string
              );
              await $getAuthentication().login(
                  tokens.access_token as string,
                  tokens.refresh_token as string
                );

              const dropboxFileSystem = $getFileSystem() as DropboxFileSystem;
              dropboxFileSystem.registerFileSystemWorker($getAuthentication() as DropboxAuth);

              return true;
            }
            default:
              throw Error("Uknown login app");
          }
        }
      }
    }

    return false;
  }
}

export const authGlobal = new Authentication();
