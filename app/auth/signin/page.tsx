"use client"
import Divider from "@components/Divider";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import React, {MouseEventHandler, useEffect, useState } from "react";
import {signInCallbackUrl} from "@globals/constants"

const SignInPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  useEffect(() => {
    const configureProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    configureProviders();
  }, []);
  
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, providerId?: string) => {
    e.preventDefault();
    let res = null;
    if (!providerId) {
      res = await signIn("credentials", { username, password, callbackUrl: signInCallbackUrl });
    } else {
      res = await signIn(providerId, { callbackUrl: signInCallbackUrl });
    }
    console.log(res)
  }



  return (
    <div className="relative flex flex-col justify-center overflow-hidden w-1/2">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center underline blue_gradient pb-2">Sign in</h1>
        <form className="mt-6">
          <div className="mb-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
              Username or Email
            </label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
             value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <a href="#" className="text-xs text-orange-600 hover:underline">
            Forget Password?
          </a>
          <div className="mt-6">
            <button type="button" className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white w-full" onClick={(e) => handleSignIn(e)}>Sign in</button>
            <Divider text="OR" />
            <div className="flex items-center justify-center">
            {Object.values(providers || {} ).filter((provider) => provider.name !== "Credentials").map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="px-2"
                title={`Sign in with ${provider.name}`}
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSignIn(e, provider.id)}
              >
                <Image src={`/assets/icons/${provider.id}.svg`} alt={provider.name} width={30} height={30} className="object-contain" />
              </button>
            ))}
            </div>
          </div>
        </form>
        <section>
          <p className="mt-8 text-xs font-light text-center text-gray-700 hover:underline"><a href="/terms">Terms and Conditions</a></p>
          <p className="mt-2 text-xs font-light text-center text-gray-700">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-orange-600 hover:underline">
              Sign up
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignInPage;
