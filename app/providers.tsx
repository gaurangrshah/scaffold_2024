import { PropsWithChildren } from "react";
import GoogleTagManagerWrapper from "./tag-mgr";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <GoogleTagManagerWrapper>{children}</GoogleTagManagerWrapper>
    </>
  );
}
