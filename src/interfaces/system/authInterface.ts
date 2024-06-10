import { assert, notNullOrThrowDev } from "@/utils";

export class AuthData {
  access_token: string | null = null;
  refresh_token: string | null = null;
}

export interface Authenticate {
  getOAuthAccessToken(oauth_code: string): Promise<AuthData>;
  login(access_token: string, refresh_token: string): Promise<void>;
  logout(): Promise<void>;
}

let auth: Authenticate | null = null;

export function $setAuthentication( a: Authenticate ) {
  assert( a == null || auth == null, "Authenticate already set" );
  auth = a;
}

export function $getAuthentication() {
  notNullOrThrowDev(auth);
  return auth;
}