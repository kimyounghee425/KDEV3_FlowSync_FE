"use client";

import { useEffect, useState } from "react";

export default function MSWComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mswReady, setMswReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      const initMsw = await import("@/src/mocks/index").then(
        (res) => res.initMSW,
      );
      await initMsw();
      setMswReady(true);
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}
