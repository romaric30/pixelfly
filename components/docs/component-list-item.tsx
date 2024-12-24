import { lazy, Suspense, useState } from "react";

import { CopyButton } from "@/components/docs/copy-button";
import { ReloadButton } from "@/components/docs/reload-button";
import { cn } from "@/lib/utils";

function Actions({
  copyId,
  onRefresh,
}: {
  copyId: string;
  onRefresh: () => void;
}) {
  return (
    <div className="inline-flex w-full justify-end p-2">
      <CopyButton
        className="bg-white text-zinc-600 shadow-none dark:bg-zinc-950 dark:text-white"
        proxyId={`source-${copyId}`}
        value=""
      />
      <ReloadButton
        className="bg-white text-zinc-600 shadow-none dark:bg-zinc-950 dark:text-white"
        onClick={onRefresh}
      />
    </div>
  );
}

const lazyList: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  "status-button": lazy(() => import("@/docs/buttons/status-button")),
};

export default function ComponentListItem({
  children,
  className,
  copyId,
  lazy,
  ...props
}: {
  copyId: string;
  className?: string;
  children: React.ReactNode;
  lazy?: boolean;
}) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const Component =
    lazy && Reflect.has(lazyList, copyId) ? lazyList[copyId] : null;
  return (
    <div
      {...props}
      className={cn(" relative h-[300px] rounded-xl border", className)}
    >
      <Actions
        copyId={copyId}
        onRefresh={() => setForceUpdate((prev) => prev + 1)}
      />
      <div
        key={`component-list-item-${copyId}-${forceUpdate}`}
        className="flex max-h-56 h-full flex-col items-center justify-center px-4 pb-4 !relative"
      >
        {children}
        {Component && (
          <Suspense fallback={<div className="h-full w-full" />}>
            <Component />
          </Suspense>
        )}
      </div>
    </div>
  );
}
