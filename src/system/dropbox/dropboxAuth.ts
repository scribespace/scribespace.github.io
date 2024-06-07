import { ThrowDropboxError, DROPBOX_APP } from "./dropboxCommon";
import * as DropboxAPI from "dropbox";
import { Authenticate, AuthData } from "@/interfaces/system/authInterface";
import { CLIENT_ID } from "./dropboxCommon";
import { REDIRECT_URI } from "./dropboxCommon";

export class DropboxAuth implements Authenticate {
  private dbxAuth: DropboxAPI.DropboxAuth;
  private dbx: DropboxAPI.Dropbox | null = null;

  constructor() {
    this.dbxAuth = new DropboxAPI.DropboxAuth({
      clientId: CLIENT_ID,
    });
  }

  GetDropboxAuth(): DropboxAPI.DropboxAuth {
    return this.dbxAuth;
  }
  SetDropbox(dbx: DropboxAPI.Dropbox) {
    this.dbx = dbx;
  }

  async RequestLogin() {
    const authUrl = await this.dbxAuth.getAuthenticationUrl(
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
      this.dbxAuth.getCodeVerifier()
    );
    window.location.href = String(authUrl);
  }

  async GetOAuthAccessToken(oauth_code: string): Promise<AuthData> {
    const sessionCode = window.sessionStorage.getItem("codeVerifier");
    if (!sessionCode) {
      ThrowDropboxError("There is no codeVerifier. Call RequestLogin() first");
    }

    this.dbxAuth.setCodeVerifier(sessionCode);
    const login = (
      await this.dbxAuth.getAccessTokenFromCode(REDIRECT_URI, oauth_code)
    ).result as AuthData;
    return login;
  }

  async Login(access_token: string, refresh_token: string): Promise<void> {
    this.dbxAuth.setAccessToken(access_token);
    this.dbxAuth.setRefreshToken(refresh_token);
    this.dbxAuth.setClientId(CLIENT_ID);

    this.dbx = new DropboxAPI.Dropbox({
      auth: this.dbxAuth,
    });

    const response = await this.dbx.usersGetCurrentAccount();
    if (!response?.result.account_id) {
      ThrowDropboxError("Login() failed");
    }
  }

  async Logout(): Promise<void> {
    if (!this.dbx) {
      ThrowDropboxError("Logout: no Dropbox object!");
    }

    const response = await this.dbx.authTokenRevoke();
    if (!response) {
      ThrowDropboxError("Logout failed");
    }
  }
}
