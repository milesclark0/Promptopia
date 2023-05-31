"use client";
import Divider from "@components/Divider";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import React, { MouseEventHandler, useCallback, useEffect, useReducer, useState } from "react";
import { signInCallbackUrl } from "@globals/constants";
import { redirect, useRouter } from "next/navigation";
import ErrorBadge from "@components/ErrorBadge";
import { reducer, initialState, SIGNUP_ACTIONS } from "./reducer";

const SignInPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  useEffect(() => {
    const configureProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    configureProviders();
  }, []);

  const checkPasswordsMatch = () => {
    const errMsg = "Passwords do not match";
    if (state.password !== state.confirmPassword) {
      dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, confirmPassword: errMsg } });
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, providerId?: string) => {
    e.preventDefault();
    setSubmitting(true);
    if (!providerId && !checkPasswordsMatch()) {
      return;
    }
    dispatch({ type: SIGNUP_ACTIONS.CLEAR_ERRORS });
    const name = `${state.firstName} ${state.lastName}`.trim();
    const body = {
      name,
      username: state.username,
      password: state.password,
      email: state.email,
    };
    let res = null;
    if (!providerId) {
      res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res?.ok) {
        const body = await res?.json();
        dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...body.error } });
      }
    } else {
      // just use next/auth signin
      res = await signIn(providerId, { redirect: false });
    }

    setSubmitting(false);
    console.log(res);
    if (res?.ok) {
      router.push(signInCallbackUrl);
    }
  };

  const getErrors = useCallback(() => {
    if (!state.errors) return [];
    const errors: string[] = [];
    Object.values(state.errors).forEach((error) => {
      if (error !== "") {
        errors.push(error);
      }
    });
    return errors.map((err) => `[${err}] `);
  }, [state.errors]);

  function doesInputHaveError(inputKey: string) {
    return state.errors[inputKey as keyof typeof state.errors] ? "border-red-400" : "border";
  }
  return (
    <div className="relative flex flex-col justify-center overflow-hidden w-1/2">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center underline blue_gradient pb-2">Sign in</h1>
        <form className="mt-6" autoComplete="none">
          <div className="mb-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800 ">
              Username
            </label>
            <input
              type="username"
              value={state.username}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, username: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_USERNAME, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "username"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="username" className="block text-sm font-semibold text-red-600">
              {state.errors.username}
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, email: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_EMAIL, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "email"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="email" className="block text-sm font-semibold text-red-600">
              {state.errors.email}
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800">
              First Name
            </label>
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, name: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_FIRST_NAME, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "name"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="fistName" className="block text-sm font-semibold text-red-600">
              {state.errors["name"]}
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="lname" className="block text-sm font-semibold text-gray-800">
              Last Name
            </label>
            <input
              name="lname"
              id="lname"
              value={state.lastName}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, name: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_LAST_NAME, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "name"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="lname" className="block text-sm font-semibold text-red-600">
              {state.errors["name"]}
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              autoComplete="off"
              value={state.password}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, password: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_PASSWORD, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "password"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="password" className="block text-sm font-semibold text-red-600">
              {state.errors.password}
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="off"
              value={state.confirmPassword}
              onChange={(e) => {
                dispatch({ type: SIGNUP_ACTIONS.SET_ERRORS, payload: { ...state.errors, confirmPassword: "" } });
                dispatch({ type: SIGNUP_ACTIONS.SET_CONFIRM_PASSWORD, payload: e.target.value });
              }}
              className={`block w-full px-4 py-2 mt-2 bg-white border ${doesInputHaveError(
                "confirmPassword"
              )} rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40`}
            />
            <label htmlFor="password" className="block text-sm font-semibold text-red-600">
              {state.errors.confirmPassword}
            </label>
          </div>
          <button
            type="button"
            className="px-5 py-1.5 text-sm"
            onClick={() => {
              dispatch({ type: SIGNUP_ACTIONS.CLEAR_FIELDS });
            }}
          >
            Clear Form
          </button>
          <a href="#" className="text-xs text-orange-600 hover:underline">
            Forget Password?
          </a>
          <ErrorBadge title="Sign up Error(s)" show={getErrors().length > 0} onClose={() => dispatch({ type: SIGNUP_ACTIONS.CLEAR_ERRORS })}>
            Please fix form errors.
          </ErrorBadge>
          <div className="mt-6">
            <button type="button" className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white w-full" onClick={(e) => handleSignUp(e)}>
              Sign Up
            </button>
            <Divider text="OR" />
            <div className="flex items-center justify-center">
              <p className="text-sm font-semibold text-gray-800">Sign up with</p>
              {Object.values(providers || {})
                .filter((provider) => provider.name !== "Credentials")
                .map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    className="px-2"
                    title={`Sign up with ${provider.name}`}
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSignUp(e, provider.id)}
                  >
                    <Image src={`/assets/icons/${provider.id}.svg`} alt={provider.name} width={30} height={30} className="object-contain" />
                  </button>
                ))}
            </div>
          </div>
        </form>
        <section>
          <p className="mt-8 text-xs font-light text-center text-gray-700 hover:underline">
            <a href="/terms">Terms and Conditions</a>
          </p>
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
