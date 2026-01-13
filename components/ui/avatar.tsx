"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-background-light",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName


interface AvatarNameProps {
  name: string;
  className?: string;
}

/**
 * AvatarName - displays initials in a circle, given a name string.
 */
const AvatarName = ({ name, className }: AvatarNameProps) => {
  // Split name by spaces, filter out empty, take first char of first and last (if present)
  const parts = name.trim().split(/\s+/);
  let initials = "";
  if (parts.length === 1) {
    initials = parts[0][0]?.toUpperCase() || "";
  } else if (parts.length > 1) {
    const firstInitial = parts[0][0];
    const lastInitial = parts[parts.length - 1][0];
    initials = (firstInitial + lastInitial).toUpperCase();
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-background-light font-medium w-full h-full",
        className
      )}
    >
      {initials}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarName }
