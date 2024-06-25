import { ThrowDropboxError, DROPBOX_APP } from "./dropboxCommon";
import * as DropboxAPI from "dropbox";
import { Authenticate, AuthData } from "@/interfaces/system/authInterface";
import { CLIENT_ID } from "./dropboxCommon";
import { REDIRECT_URI } from "./dropboxCommon";

export class DropboxAuth implements Authenticate {
  private __dbxAuth: DropboxAPI.DropboxAuth;
  private __dbx: DropboxAPI.Dropbox | null = null;

  constructor() {
    this.__dbxAuth = new DropboxAPI.DropboxAuth({
      clientId: CLIENT_ID,
    });
  }

  getDropboxAuth(): DropboxAPI.DropboxAuth {
    return this.__dbxAuth;
  }
  setDropbox(dbx: DropboxAPI.Dropbox) {
    this.__dbx = dbx;
  }

  static async requestLogin() {
    const dbxAuth = new DropboxAPI.DropboxAuth({ clientId: CLIENT_ID});
    const authUrl = await dbxAuth.getAuthenticationUrl(
      REDIRECT_URI, // redirectUri - A URL to redirect the user to after authenticating. This must be added to your app through the admin interface.
      DROPBOX_APP, // state - State that will be returned in the redirect URL to help prevent cross site scripting attacks.
      "code", // authType - auth type, defaults to 'token', other option is 'code'

      /* tokenAccessTyp - type of token to request.  From the following:
       * null - creates a token with the app default (either legacy or online)
       * legacy - creates one long-lived token with no expiration
       * online - create one short-lived token with an expiration
       * offline - create one short-lived token with an expiration with a refresh token*/
      "offline",

      undefined, // scope - scopes to request for the grant

      /* includeGrantedScopes - whether or not to include previously granted scopes.
       * From the following:
       * user - include user scopes in the grant
       * team - include team scopes in the grant
       * Note: if this user has never linked the app, include_granted_scopes must be None*/
      undefined,

      /* usePKCE - Whether or not to use Sha256 based PKCE. PKCE should be only use
       * on client apps which doesn't call your server. It is less secure than non-PKCE flow but
       * can be used if you are unable to safely retrieve your app secret*/
      true
    );
    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      "codeVerifier",
      dbxAuth.getCodeVerifier()
    );
    window.location.href = String(authUrl);
  }

  async getOAuthAccessToken(oauth_code: string): Promise<AuthData> {
    const sessionCode = window.sessionStorage.getItem("codeVerifier");
    if (!sessionCode) {
      ThrowDropboxError("There is no codeVerifier. Call RequestLogin() first");
    }

    this.__dbxAuth.setCodeVerifier(sessionCode);
    const login = (
      await this.__dbxAuth.getAccessTokenFromCode(REDIRECT_URI, oauth_code)
    ).result as AuthData;
    return login;
  }

  async login(access_token: string, refresh_token: string): Promise<void> {
    this.__dbxAuth.setAccessToken(access_token);
    this.__dbxAuth.setRefreshToken(refresh_token);
    this.__dbxAuth.setClientId(CLIENT_ID);

    this.__dbx = new DropboxAPI.Dropbox({
      auth: this.__dbxAuth,
    });

    const response = await this.__dbx.usersGetCurrentAccount();
    if (!response?.result.account_id) {
      ThrowDropboxError("Login() failed");
    }
  }

  async logout(): Promise<void> {
    if (!this.__dbx) {
      ThrowDropboxError("Logout: no Dropbox object!");
    }

    const response = await this.__dbx.authTokenRevoke();
    if (!response) {
      ThrowDropboxError("Logout failed");
    }
  }
}
