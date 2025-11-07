import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/Button.module.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "edit"
  | "delete"
  | "assign"
  | "unassign"
  | "error";

interface ButtonProps {
  variant: ButtonVariant;
  onClick?: () => void;
  children: React.ReactNode;
  small?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  children,
  small = false,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        small ? styles.small : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {children}
    </button>
  );
};

export default Button;
