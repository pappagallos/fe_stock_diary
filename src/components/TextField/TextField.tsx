"use client";

import React, { ChangeEvent, useState } from "react";
import classNames from "classnames";

// 타입
import { ITextFieldProps } from "./TextFieldTypes";

// 스타일
import styles from "./TextField.module.scss";

/**
 * 텍스트 필드 컴포넌트
 */
export default function TextField({
  type, // 타입
  value, // 값
  label, // 라벨
  textAlign, // 정렬
  placeholder, // 플레이스홀더
  checkFormatRegex, // 포맷 검사 정규식
  checkFormatter, // 포맷 검사 함수
  autoCompletionList, // 자동 완성 리스트
  onChange, // 변경 이벤트
  isDisabled, // 비활성화 여부
  style, // 스타일
}: ITextFieldProps) {
  // 포커스 여부
  const [focused, setFocused] = useState(false);

  // 포맷 검사
  const isValidFormat = checkFormat(value);

  /**
   * 텍스트 필드 포맷 검사
   * @param value 검사할 값
   * @returns 포맷 검사 결과
   */
  function checkFormat(value: string) {
    // 포맷 검사 함수가 있으면 함수 실행
    // 1순위
    if (checkFormatter) return checkFormatter(value);
    // 포맷 검사 정규식이 있으면 정규식 검사
    // 2순위
    return value === "" || new RegExp(checkFormatRegex || ".*").test(value);
  }

  // 사용자가 입력한 종목 티커명 중에서 관련있는 티커명을 필터링한 자동 완성 리스트
  const filteredAutoCompletionList = autoCompletionList?.filter(
    (item) => value.length > 0 && item.includes(value)
  );

  /**
   * 텍스트 필드 데이터 변경 이벤트
   * @param event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    onChange({ isValidFormat, value });
  }

  /**
   * 자동 완성 리스트의 클릭 이벤트
   * @param value 클릭한 자동 완성 값
   */
  function handleClickCompletion(value: string) {
    onChange({ isValidFormat, value });
  }

  return (
    <>
      {/* 라벨 */}
      {label && <p className={styles.label}>{label}</p>}
      {/* 텍스트 필드 */}
      <div className={styles.text_field_container}>
        <div
          className={classNames(styles.text_field, {
            [styles.focused]: focused,
            [styles.error]: !isValidFormat,
          })}
          style={style}
          role="textbox"
        >
          {/* 텍스트 필드 입력 */}
          <input
            type={type || "text"}
            placeholder={placeholder || ""}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={
              () =>
                autoCompletionList && autoCompletionList.length > 0
                  ? setTimeout(() => setFocused(false), 200) // 자동 완성 리스트가 있으면 200ms 후에 포커스 해제, 200ms 후에 헤제하는 이유는 자동 완성 리스트가 있으면 포커스 해제 시 자동 완성 리스트가 사라지는 것을 방지하기 위함
                  : setFocused(false) // 자동 완성 리스트가 없으면 바로 포커스 해제
            }
            style={{ textAlign: textAlign || "left" }}
            disabled={isDisabled}
            role="input"
          />
        </div>
        {/* 자동 완성 리스트 */}
        {filteredAutoCompletionList &&
          filteredAutoCompletionList.length > 0 && (
            <div className={styles.auto_completion_list} role="listbox">
              <ul>
                {filteredAutoCompletionList.map((completion) => (
                  <li
                    onClick={() => handleClickCompletion(completion)}
                    key={completion}
                    role="listitem"
                  >
                    {completion}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </>
  );
}
