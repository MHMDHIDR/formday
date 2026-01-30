"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className" | "href"> {
  to: string;
  className?:
    | string
    | ((props: {
        isActive: boolean;
        isPending: boolean;
      }) => string | undefined);
  activeClassName?: string;
  pendingClassName?: string;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    { className, activeClassName, pendingClassName, to, children, ...props },
    ref,
  ) => {
    const pathname = usePathname();
    const isActive = pathname === to || pathname?.startsWith(to) || false;
    const isPending = false; // Next.js doesn't expose pending state easily here

    const computedClassName =
      typeof className === "function"
        ? className({ isActive, isPending })
        : className;

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(computedClassName, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
