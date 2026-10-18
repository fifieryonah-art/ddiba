export default function Button({
  children,
  variant = "primary",
  full = true,
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${full ? "btn-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
