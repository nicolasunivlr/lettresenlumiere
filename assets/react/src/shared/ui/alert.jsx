export const Alert = ({ children, variant = "error", className }) => {
  if (!children) return null;

  return (
    <div className={`alert alert--${variant} ${className ?? ""}`}>
      {children}
    </div>
  );
};
