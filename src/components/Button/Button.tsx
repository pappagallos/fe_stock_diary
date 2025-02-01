import React from "react";
import classNames from "classnames";

// 타입
import { IButtonProps } from "./ButtonTypes";

// 스타일
import styles from "./Button.module.scss";

export default function Button({
  value,
  className,
  isPending,
  isDisabled,
  onClick,
  style,
}: IButtonProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        styles.button,
        className ? styles[className] : styles.primary,
        {
          [styles.disabled]: isDisabled,
          [styles.pending]: isPending,
        }
      )}
      style={style}
      role="button"
    >
      <img
        src="/assets/svgs/ico_loading_w.svg"
        alt="loading"
        className={styles.loading}
      />
      <span className={styles.value}>{value}</span>
    </div>
  );
}
