import React, { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";

// 스토어
import { useGlobalStore } from "@/store";

// 타입
import { GlobalStore } from "@/store/types";
import {
  IStatus,
  IDiaryAsset,
  ITradingLogViewerProps,
  IDiaryAssetInitData,
} from "@/components/TradingLogViewer/TradingLogViewerTypes";
import { ITradingLogDeleteData } from "@/app/types";
import { IAddDiaryAsset } from "@/components/AddTradingLogForm/AddTradingLogFormTypes";

// 컴포넌트
import Button from "@/components/Button/Button";
import AddTicker from "@/components/AddTicker/AddTicker";
import DiaryAsset from "../DiaryAsset/DiaryAsset";

// 유틸리티
import { callApi } from "@/utils/api";

// 스타일
import styles from "@/components/TradingLogViewer/TradingLogViewer.module.scss";

export default function TradingLogViewer({
  diaryId,
  tradingLog,
  onDelete,
}: ITradingLogViewerProps) {
  const marketAssets = useGlobalStore(
    (state: GlobalStore) => state.marketAssets
  );

  // 종목 추가 리스트
  const [addAssets, setAddAssets] = useState<IAddDiaryAsset[]>([
    { ticker: "", amount: "", buy_price: "", asset_id: null },
  ]);
  // 종목 추가 버튼 비활성화 여부
  const isDisabledAddAsset =
    addAssets[0].ticker === "" ||
    !marketAssets.find((asset) => asset.ticker === addAssets[0].ticker);

  // API 호출 상태
  const [status, _setStatus] = useState<IStatus>({
    isPendingForFetch: false, // 종목 조회 로딩
    isPendingForDelete: false, // 삭제 로딩
    isPendingForUpdate: false, // 추가 로딩
  });
  function setStatus(key: keyof IStatus, value: boolean) {
    _setStatus((prevStatus) => ({
      ...prevStatus,
      [key]: value,
    }));
  }

  // 투자 일지 내 종목 리스트
  const [diaryAssets, setDiaryAssets] = useState<IDiaryAsset[]>([]);

  useEffect(() => {
    if (!tradingLog) return;
    clearAddAssets();
    clearAssets();
    initAssets();
  }, [tradingLog]);

  /**
   * 투자 일지 내 종목 리스트 초기화
   * @returns
   */
  function clearAssets() {
    setDiaryAssets([]);
  }

  /**
   * 종목 추가 리스트 초기화
   * @returns
   */
  function clearAddAssets() {
    setAddAssets([{ ticker: "", amount: "", buy_price: "", asset_id: null }]);
  }

  /**
   * 투자 일지 내 종목 리스트 초기화
   * @param options 옵션 데이터
   * @returns
   */
  async function initAssets(options: IDiaryAssetInitData | void) {
    if (!tradingLog) return;

    const useLoading = options?.useLoading ?? true;

    try {
      useLoading && setStatus("isPendingForFetch", true);
      const response = await callApi(`/diaries/${tradingLog?.id}/assets.json`, {
        method: "GET",
      });
      const responseData = await response.json();

      // 종목 id 내림차순으로 정렬
      setDiaryAssets(
        responseData.sort((a: IDiaryAsset, b: IDiaryAsset) => b.id - a.id)
      );
    } catch (error: any) {
      throw new Error(error);
    } finally {
      useLoading && setStatus("isPendingForFetch", false);
    }
  }

  /**
   * 투자 일지 삭제
   * @param options 옵션 데이터
   * @returns
   */
  async function handleDelete(options: ITradingLogDeleteData | void) {
    if (!tradingLog || status.isPendingForDelete) return;
    const useLoading = options?.useLoading ?? true;
    try {
      useLoading && setStatus("isPendingForDelete", true);
      await callApi(`/diaries/${tradingLog.id}.json`, {
        method: "DELETE",
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setStatus("isPendingForDelete", false);
      onDelete({ useLoading: false });
    }
  }

  /**
   * 투자 일지 내 삭제 후 종목 리스트 초기화
   * @returns
   */
  async function handleClickDeleteMyAsset() {
    clearAddAssets();
    initAssets({ useLoading: false });
  }

  /**
   * 투자 일지 내 종목 추가
   * @returns
   */
  async function handleAddAsset() {
    if (!diaryId || isDisabledAddAsset || status.isPendingForUpdate) return;

    try {
      setStatus("isPendingForUpdate", true);
      const body = {
        diary_asset: {
          diary_id: diaryId,
          asset_id: addAssets[0].asset_id, // 투자 일지 내 종목 추가는 한 번에 하나씩만 가능하므로 0번째 인덱스만 사용
          amount: addAssets[0].amount,
          buy_price: addAssets[0].buy_price,
        },
      };
      await callApi("/diary_assets.json", {
        method: "POST",
        body,
      });
      clearAddAssets();
      initAssets({ useLoading: false });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setStatus("isPendingForUpdate", false);
    }
  }

  /**
   * 종목 추가에서 입력 값 변경
   * @param index 인덱스
   * @param key 키
   * @param value 값
   * @returns
   */
  function onChangeAddAsset(
    index: number,
    key: keyof IAddDiaryAsset,
    value: string | null
  ) {
    const newAssets = [...addAssets];
    if (key !== "asset_id") newAssets[index][key] = value as string;
    newAssets[index].asset_id =
      marketAssets.find((asset) => asset.ticker === newAssets[index].ticker)
        ?.id ?? null;
    setAddAssets(newAssets);
  }

  if (!tradingLog) return null;

  return (
    <div className={styles.trading_log_viewer}>
      {/* 투자 일지 헤더 */}
      <div className={styles.trading_log_viewer_header}>
        {/* 투자 일지 날짜 */}
        <h2 className={styles.trading_log_viewer_header_date}>
          {new Date(tradingLog.date).toLocaleDateString("ko-KR")}
        </h2>
        {/* 투자 일지 제목 */}
        <h1 className={styles.trading_log_viewer_header_title}>
          {tradingLog.title}
        </h1>
      </div>
      {/* 투자 일지 내용 */}
      <div className={styles.trading_log_viewer_content}>
        <div className={styles.trading_contents}>
          <p
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(tradingLog.contents.replace(/\n/g, "<br>")),
            }}
          ></p>
        </div>
      </div>
      {/* 로딩 아이콘 */}
      {status.isPendingForFetch && (
        <div className={styles.loading}>
          <img src="/assets/svgs/ico_loading.svg" alt="loading" />
        </div>
      )}
      {/* 투자 일지 종목 추가 */}
      {!status.isPendingForFetch && (
        <AddTicker
          assets={addAssets}
          onChangeAsset={onChangeAddAsset}
          onClickAddAsset={handleAddAsset}
          isPending={status.isPendingForUpdate}
          isDisabled={isDisabledAddAsset}
          style={{ marginBottom: "20px" }}
        />
      )}
      {/* 투자 일지 내 종목 리스트 */}
      {diaryAssets.length > 0 && (
        <div className={styles.my_tickers} role="list">
          {diaryAssets.map((asset, index) => {
            const currentMarketAsset = marketAssets.find(
              (marketTicker) => marketTicker.id === asset.asset_id
            );
            const currentPrice = Number(currentMarketAsset?.price);
            const purchasePrice = Number(asset.buy_price);
            const profitRate =
              ((currentPrice - purchasePrice) / purchasePrice) * 100;
            return (
              <DiaryAsset
                assetId={asset.id}
                assetName={currentMarketAsset?.name ?? ""}
                purchasePrice={purchasePrice}
                currentPrice={currentPrice}
                profitRate={profitRate}
                onDelete={handleClickDeleteMyAsset}
                key={index}
              />
            );
          })}
        </div>
      )}
      {/* 투자 일지 삭제 버튼 */}
      <div className={styles.trading_log_viewer_footer}>
        <Button
          value="삭제"
          className="danger"
          onClick={handleDelete}
          isPending={status.isPendingForDelete}
        />
      </div>
    </div>
  );
}
