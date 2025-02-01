import React, { useState } from "react";
import classNames from "classnames";

// 타입
import { IDiaryAssetProps } from "@/components/DiaryAsset/DiaryAssetType";

// 스타일
import styles from "./DiaryAsset.module.scss";

// 아이콘
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { callApi } from "@/utils/api";

export default function DiaryAsset({
  assetId, // 종목 아이디
  assetName, // 종목 이름
  purchasePrice, // 매수가
  currentPrice, // 현재가
  profitRate, // 수익률
  onDelete, // 삭제 함수
}: IDiaryAssetProps) {
  const [isPending, setIsPending] = useState(false);

  /**
   * 삭제 버튼 클릭 시 호출되는 함수
   * @param assetId 삭제할 종목의 아이디
   */
  async function handleClickDelete(assetId: number) {
    if (isPending) return;
    try {
      setIsPending(true);
      await callApi(`/diary_assets/${assetId}.json`, {
        method: "DELETE",
      });
      onDelete();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.ticker} role="listitem">
      {/* 종목 이름 */}
      <div className={styles.ticker_name}>
        <span>{assetName}</span>
        {/* 삭제 아이콘 영역 */}
        <div className={styles.ticker_delete_icon}>
          {/* 로딩 아이콘 */}
          {isPending && (
            <img src="/assets/svgs/ico_loading.svg" alt="loading" />
          )}
          {/* 삭제 버튼 */}
          {!isPending && (
            <DeleteOutlineIcon
              className={styles.delete_icon}
              onClick={() => handleClickDelete(assetId)}
              data-testid="delete-button"
            />
          )}
        </div>
      </div>
      {/* 종목 정보 표시 */}
      <div className={styles.ticker_item}>
        <p className={styles.label}>매수가</p>
        <p className={styles.value}>
          {purchasePrice.toLocaleString("ko-KR")}원
        </p>
      </div>
      <div className={styles.ticker_item}>
        <p className={styles.label}>현재가</p>
        <p className={styles.value}>{currentPrice.toLocaleString("ko-KR")}원</p>
      </div>
      <div className={styles.ticker_item}>
        <p className={styles.label}>수익률</p>
        <p
          className={classNames(styles.value, {
            [styles.positive]: profitRate > 0,
            [styles.negative]: profitRate < 0,
          })}
        >
          {profitRate.toLocaleString("ko-KR")}%
        </p>
      </div>
    </div>
  );
}
