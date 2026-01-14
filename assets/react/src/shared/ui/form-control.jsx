import React from "react";

export const FormControl = ({
  label,
  children,
  error,
  className,
  ...props
}) => {
  const { props: childProps, type: childType } = React.Children.only(children);

  const decoratedChild = React.cloneElement(children, {
    className: `form-control__child ${childProps.className ?? ""}`,
  });

  return (
    <div {...props} className={`form-control ${className ?? ""}`}>
      {label ? (
        <label
          htmlFor={childProps.id || childProps.name}
          className="form-control__label"
        >
          {label}
        </label>
      ) : null}
      <div
        className={`form-control__wrapper ${
          error ? "form-control__wrapper--error" : ""
        }`}
      >
        {decoratedChild}
      </div>
      {error && <p className="form-control__error">{error}</p>}
    </div>
  );
};
