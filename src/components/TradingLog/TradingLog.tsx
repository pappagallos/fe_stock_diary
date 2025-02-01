import React from "react";
import sanitizeHtml from "sanitize-html";

// 타입
import { ITradingLogProps } from "./TradingLogTypes";

// 스타일
import styles from "./TradingLog.module.scss";

export default function TradingLog({
  title, // 투자 일지 제목
  contents, // 투자 일지 내용
  date, // 투자 일지 날짜
  onClick, // 투자 일지 클릭 이벤트
}: ITradingLogProps) {
  return (
    <div className={styles.log} onClick={onClick}>
      {/* 투자 일지 헤더 */}
      <div className={styles.header}>
        {/* 투자 일지 날짜 */}
        <p className={styles.date}>
          {new Date(date).toLocaleDateString("ko-KR")}
        </p>
        {/* 투자 일지 제목 */}
        <div className={styles.title}>{title}</div>
      </div>
      {/* 투자 일지 내용 */}
      <div className={styles.contents}>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(contents.replace(/\n/g, "<br>")),
          }}
        ></p>
      </div>
    </div>
  );
}
