import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

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
