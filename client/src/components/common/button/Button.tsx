import type { ButtonProps } from "../../../types/ui";
import "./Button.css";

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
