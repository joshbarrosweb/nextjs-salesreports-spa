import { createContext, useState, useEffect } from "react";
import { setCookie, parseCookies } from "nookies";

import { useAuthService } from "../services/auth.service";

import Router from "next/router";
import { httpClient } from "util/http/api";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
};

export type SignInData = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  const auth = useAuthService();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextjs-token": token } = parseCookies();

    if (token) {
      auth.userInfoService(token).then((response) => setUser(response.user));
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await auth
      .loginAuthService(email, password)
      .then((result) => {
        console.log(result);
        setCookie(undefined, "nextjs-token", token, {
          maxAge: 60 * 60 * 1, // 1 hour
        });

        httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);

        Router.push("/dashboard");
      });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
