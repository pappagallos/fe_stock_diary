"use client";

import React from "react";
import classNames from "classnames";

// 타입
import { ICircleButtonProps } from "./CircleButtonTypes";

// 스타일
import styles from "./CircleButton.module.scss";

export default function CircleButton({
  className,
  onClick,
  children,
}: ICircleButtonProps) {
  return (
    <div
      className={classNames(styles.circle_button, className)}
      onClick={onClick}
      role="button"
    >
      {children}
    </div>
  );
}
