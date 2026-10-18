import React from "react";

/**
 * Shared responsive page shell. Use single mode for regular page content,
 * wide mode for centered single-column flows, and split mode with left and
 * right slots for desktop two-panel pages.
 */
export default function ResponsiveLayout({
  children,
  className = "",
  mode = "single",
  left,
  right,
}) {
  const layoutClass = [
    "responsive-layout",
    `responsive-layout--${mode}`,
    className,
  ].filter(Boolean).join(" ");

  if (mode === "split") {
    return (
      <main className={layoutClass}>
        <section className="responsive-layout__slot responsive-layout__slot--left">
          {left}
        </section>
        <section className="responsive-layout__slot responsive-layout__slot--right">
          {right}
        </section>
      </main>
    );
  }

  return <main className={layoutClass}>{children}</main>;
}
