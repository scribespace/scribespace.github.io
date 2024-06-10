import { assert, notNullOrThrowDev } from "@/utils";

export class AuthData {
  access_token: string | null = null;
  refresh_token: string | null = null;
}

export interface Authenticate {
  GetOAuthAccessToken(oauth_code: string): Promise<AuthData>;
  Login(access_token: string, refresh_token: string): Promise<void>;
  Logout(): Promise<void>;
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