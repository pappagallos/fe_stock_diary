import React from "react";
import classNames from "classnames";

// 타입
import { IModalProps } from "./ModalTypes";

// 스타일
import styles from "./Modal.module.scss";

export default function Modal({
  width,
  isOpen,
  onClose,
  children,
}: IModalProps) {
  /**
   * 모달 닫기 이벤트
   * @param event
   */
  function handleClose(event: React.MouseEvent<HTMLDivElement>) {
    // target은 이벤트를 발생시킨 엘리먼트
    // currentTarget은 이벤트가 설정된 엘리먼트
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div
      className={classNames(styles.modal_backdrop, {
        [styles.open]: isOpen,
      })}
      onClick={handleClose}
    >
      {/* 모달 */}
      <div className={styles.modal} style={{ width }}>
        {children}
      </div>
    </div>
  );
}
