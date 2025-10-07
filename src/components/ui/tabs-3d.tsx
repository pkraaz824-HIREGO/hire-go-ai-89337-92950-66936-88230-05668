import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs3D = TabsPrimitive.Root;

const Tabs3DList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm p-1.5 text-muted-foreground border border-border shadow-[var(--card-3d-shadow)]",
      className
    )}
    {...props}
  />
));
Tabs3DList.displayName = TabsPrimitive.List.displayName;

const Tabs3DTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--card-3d-shadow)] data-[state=active]:scale-105",
      "hover:bg-accent/50 hover:text-accent-foreground",
      "transform-gpu transition-transform duration-200",
      className
    )}
    {...props}
  />
));
Tabs3DTrigger.displayName = TabsPrimitive.Trigger.displayName;

const Tabs3DContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-fade-in",
      className
    )}
    {...props}
  />
));
Tabs3DContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs3D, Tabs3DList, Tabs3DTrigger, Tabs3DContent };
