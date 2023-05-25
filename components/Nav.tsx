"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders, ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";

const Nav = () => {
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  const [toggleDropdown, setToggledDropdown] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const configureProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    configureProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image src="/assets/images/logo.svg" width={30} height={30} alt="Promptopia Logo" className="object-contain" />
        <p className="logo_text">Promtopia</p>
      </Link>


      {/* Desktop Navigation */}


      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Prompt
            </Link>
            <button type="button" onClick={() => signOut()} className="outline_btn">
              Sign Out
            </button>
            <Link href="profile">
              <Image src={session?.user.image || ""} width={37} height={37} alt="Profile" className="rounded-full" />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <a key={provider.name} href="api/auth/signin" className="mt-5 w-full black_btn">
                  Sign In with {provider.name}
                </a>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}


      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image || ""}
              width={37}
              height={37}
              alt="Profile"
              className="rounded-full"
              onClick={() => setToggledDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link href="/profile" className="dropdown_link" onClick={() => setToggledDropdown(false)}>
                  My Profile
                </Link>
                <Link href="/create-prompt" className="dropdown_link" onClick={() => setToggledDropdown(false)}>
                  Create Prompt
                </Link>
                <button type="button" className="mt-5 w-full black_btn" onClick={() => signOut()}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn">
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
