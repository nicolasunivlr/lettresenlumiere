export const InputPassword = ({ className, ...inputProps }) => {
  return (
    <input
      type="password"
      className={`input-password ${className}`}
      {...inputProps}
    />
  );
};
