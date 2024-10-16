import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import {
  authLoginCreate,
  authGoogleCreate,
  authTokenRefreshCreate,
  authLogoutCreate,
  OpenAPI,
} from "./client";
import { setBasePathToAPI } from "./lib/utils";

// These two values should be a bit less than actual token lifetimes
// 6 days
const BACKEND_ACCESS_TOKEN_LIFETIME = 6 * 24 * 60 * 60;
// 29 days
const BACKEND_REFRESH_TOKEN_LIFETIME = 29 * 24 * 60 * 60;

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_PROVIDERS = ["google", "credentials"];

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The data returned from this function is passed forward as the
      // `user` variable to the signIn() and jwt() callback
      // @ts-expect-error
      async authorize(credentials, req) {
        try {
          setBasePathToAPI();
          const response = await authLoginCreate({
            requestBody: {
              email: credentials?.email,
              password: credentials?.password || "",
            },
          });
          const data = response;
          if (data) return data;
        } catch (error: any) {
          console.error("Credentials error: ", error.toJSON());
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // JSON web tokens as session strategy
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account) {
        if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
        if (account.provider === "google") {
          try {
            setBasePathToAPI();
            const response = await authGoogleCreate({
              requestBody: {
                access_token: account["access_token"],
                id_token: account["id_token"],
              },
            });
            account["meta"] = response;
            return true;
          } catch (error) {
            return false;
          }
        } else if (account.provider === "credentials") {
          return true;
        }
      }
      return false;
    },
    async jwt({
      user,
      token,
      account,
    }: {
      user: any;
      token: any;
      account: any;
    }) {
      if (user && account) {
        let backendResponse: any =
          account.provider === "credentials" ? user : account.meta;
        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }

      // Refresh the backend token if necessary
      if (getCurrentEpochTime() > token["ref"]) {
        try {
          setBasePathToAPI();
          const response = await authTokenRefreshCreate({
            // @ts-expect-error
            requestBody: { refresh: token["refresh_token"] },
          });
          token["access"] = response.access;
          token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        } catch (error: any) {
          console.error(
            "Error while refreshing the access token",
            error.toJSON()
          );
        }
      }
      return token;
    },
    async session({ token }: { token: any }) {
      return token;
    },
  },
  events: {
    async signOut({ session, token }) {
      setBasePathToAPI();
      await authLogoutCreate();
      OpenAPI.TOKEN = undefined;
    },
  },
};
