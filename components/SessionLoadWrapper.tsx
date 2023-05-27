"use client";

import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  /*
   * The component to display while the session is loading.
   * If not provided, defaults to "Loading..."
   */
  loadingComponent?: JSX.Element;
};

const SessionLoadWrapper = ({ children, loadingComponent }: Props) => {
  const { status } = useSession();
  if (status === "loading") {
    return loadingComponent ? loadingComponent : <p>Loading...</p>;
  }
  return <>{children}</>;
};
export default SessionLoadWrapper;
