import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FormEvent,
  MouseEvent,
  ReactNode,
} from "react";

export interface NavItem {
  label: string;
  to: string;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface SignInProps {
  onClose: () => void;
}

export interface SignUpProps {
  onClose: () => void;
}

export interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  link: string;
}

export type BlogCardMouseEvent = MouseEvent<HTMLDivElement, globalThis.MouseEvent>;

export type SignFormEvent = FormEvent<HTMLFormElement>;

export type DrawerAnimationStyle = CSSProperties;
