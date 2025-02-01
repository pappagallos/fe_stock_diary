"use client";

import React, { ChangeEvent, useState } from "react";
import classNames from "classnames";

// 타입
import { ITextareaProps } from "./TextareaTypes";

// 스타일
import styles from "./Textarea.module.scss";

/**
 * 텍스트 컴포넌트
 */
export default function Textarea({
  value, // 텍스트 값
  label, // 라벨
  placeholder, // 플레이스홀더
  rows, // 크기를 결정할 Row 수
  useResize, // 리사이즈 사용 여부
  onChange, // 변경 이벤트
  isDisabled, // 비활성화 여부
}: ITextareaProps) {
  // 포커스 여부
  const [focused, setFocused] = useState(false);

  /**
   * 텍스트 데이터 변경 이벤트
   * @param event
   */
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    onChange(value);
  }

  return (
    <>
      {/* 라벨 */}
      {label && <p className={styles.label}>{label}</p>}
      {/* 텍스트 */}
      <div
        className={classNames(styles.textarea, { [styles.focused]: focused })}
      >
        {/* 텍스트 입력 */}
        <textarea
          placeholder={placeholder || ""}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows || 5}
          style={{
            resize: useResize ? "vertical" : "none",
          }}
          disabled={isDisabled}
          spellCheck={false}
        />
      </div>
    </>
  );
}
