import classNames from "classnames";
import React from "react";

// 타입
import { IAlertProps } from "./AlertTypes";

// 스타일
import styles from "./Alert.module.scss";

// 아이콘
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";

export default function Alert({ type, text }: IAlertProps) {
  return (
    <div className={classNames([styles.alert, styles[type]])}>
      {type === "error" && <ErrorOutlineIcon className={styles.icon} />}
      {type === "info" && <InfoOutlinedIcon className={styles.icon} />}
      {type === "warning" && <WarningOutlinedIcon className={styles.icon} />}
      {text}
    </div>
  );
}
