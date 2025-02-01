"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie, hasCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import Modal from "@/components/Modal/Modal";
import TradingLog from "@/components/TradingLog/TradingLog";
import CircleButton from "@/components/CircleButton/CircleButton";
import TradingLogViewer from "@/components/TradingLogViewer/TradingLogViewer";

import { callApi } from "@/utils/api";
import { useGlobalStore } from "@/store";

import styles from "./Home.module.scss";
import Button from "@/components/Button/Button";
import { GlobalStore } from "@/store/types";
import AddTradingLogForm from "@/components/AddTradingLogForm/AddTradingLogForm";
import {
  IUserInfo,
  InitTradingLogsData,
  ITradingLogCreateData,
  ITradingLogDeleteData,
  ITradingLog,
} from "./types";

export default function Home() {
  const router = useRouter();

  const setMarketAssets = useGlobalStore(
    (state: GlobalStore) => state.setMarketAssets
  );

  // 사용자 정보
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  // 사용자의 투자 일지 목록
  const [tradingLogs, setTradingLogs] = useState<ITradingLog[]>([]);

  // 클릭한 투자 일지 상세 정보
  const [clickedTradingLog, setClickedTradingLog] =
    useState<ITradingLog | null>(null);

  // 투자 일지 추가 Modal 열기 여부
  const [isOpenAddTradingLogModal, setIsOpenAddTradingLogModal] =
    useState<boolean>(false);

  // API 상태 여부
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    // 쿠키에 토큰이 있으면 사용자 정보, 종목 정보, 사용자의 투자 일지 목록 초기화
    if (hasCookie("token")) {
      const decodedToken: IUserInfo = jwtDecode(getCookie("token") as string);
      if (decodedToken?.user_id && decodedToken?.email) {
        setUserInfo(decodedToken);
        initMarketAssets();
        initTradingLogs();
      }
    }
  }, []);

  /**
   * 사용자의 투자 일지 목록 초기화
   * @param options 초기화 옵션
   */
  async function initTradingLogs(options: InitTradingLogsData) {
    const useLoading = options?.useLoading ?? true;

    try {
      useLoading && setIsPending(true);
      const response = await callApi("/diaries.json", {
        method: "GET",
      });
      const responseData = await response.json();
      // 투자 일지 날짜 내림차순 정렬
      setTradingLogs(
        responseData.sort((a: ITradingLog, b: ITradingLog) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() + b.id - (dateA.getTime() + a.id);
        })
      );
    } catch (error: any) {
      throw new Error(error);
    } finally {
      useLoading && setIsPending(false);
    }
  }

  /**
   * 마켓에 등록된 전체 종목 정보 초기화
   */
  async function initMarketAssets() {
    try {
      const response = await callApi("/assets.json", { method: "GET" });
      const responseData = await response.json();
      setMarketAssets(responseData);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * 투자 일지 추가 버튼 클릭
   */
  function onClickTradingLogAddButton() {
    handleOpenAddTradingLogModal();
  }

  /**
   * 투자 일지 상세 Modal 닫기
   */
  function handleCloseTradingLogModal() {
    setClickedTradingLog(null);
  }

  /**
   * 투자 일지 추가 Modal 열기
   */
  function handleOpenAddTradingLogModal() {
    setIsOpenAddTradingLogModal(true);
  }

  /**
   * 투자 일지 추가 Modal 닫기
   */
  function handleCloseAddTradingLogModal() {
    setIsOpenAddTradingLogModal(false);
  }

  /**
   * 투자 일지 클릭
   * @param tradingLog 클릭한 투자 일지 정보
   */
  function handleClickTradingLog(tradingLog: ITradingLog) {
    setClickedTradingLog(tradingLog);
  }

  /**
   * 투자 일지 추가 완료
   * @param options 추가 옵션
   */
  function onCreateTradingLog(options: ITradingLogCreateData) {
    initTradingLogs(options);
    handleCloseAddTradingLogModal();
  }

  /**
   * 투자 일지 삭제 완료
   * @param options 삭제 옵션
   */
  function onDeleteTradingLog(options: ITradingLogDeleteData) {
    initTradingLogs(options);
    handleCloseTradingLogModal();
  }

  /**
   * 로그아웃 버튼 클릭
   */
  function onClickLogoutButton() {
    deleteCookie("token");
    router.push("/signin");
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        {/* 좌측 메뉴 */}
        <div className={styles.header_left}>
          <img src="/logo.png" alt="블루밍그레이스" className={styles.logo} />
        </div>
        {/* 우측 메뉴 */}
        <div className={styles.header_right}>
          <ul className={styles.header_right_list}>
            {/* 로그인 전 */}
            {!userInfo && (
              <>
                <li>
                  <Link href="/signin" className="link color-black">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="link color-black">
                    회원가입
                  </Link>
                </li>
              </>
            )}
            {/* 로그인 후 */}
            {userInfo?.email && (
              <>
                {/* 사용자 정보 */}
                <li>
                  <span>{userInfo.email}님, 안녕하세요.</span>
                </li>
                {/* 로그아웃 버튼 */}
                <li>
                  <Button
                    value="로그아웃"
                    onClick={onClickLogoutButton}
                    className="secondary"
                    style={{
                      padding: "8px 10px",
                      height: "auto",
                      fontSize: "1.4rem",
                      boxSizing: "border-box",
                    }}
                  />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className={styles.body}>
        {/* 로딩 아이콘 */}
        {isPending && (
          <div className={styles.loading}>
            <img src="/assets/svgs/ico_loading.svg" alt="loading" />
          </div>
        )}
        {/* 투자 일지 목록 */}
        {!isPending && (
          <div className={styles.logs}>
            {tradingLogs.map((log, index) => (
              <TradingLog
                date={log.date}
                title={log.title}
                contents={log.contents}
                onClick={() => handleClickTradingLog(log)}
                key={index}
              />
            ))}
          </div>
        )}
        {/* 투자 일지 추가 버튼 */}
        {userInfo && (
          <CircleButton
            className={styles.trading_log_add_button}
            onClick={onClickTradingLogAddButton}
          >
            <img
              src="/assets/svgs/ico_add.svg"
              className={styles.add_icon}
              alt="add"
            />
          </CircleButton>
        )}
      </div>

      {/* 투자 일지 추가 Modal */}
      {userInfo && (
        <>
          <Modal
            isOpen={isOpenAddTradingLogModal}
            onClose={handleCloseAddTradingLogModal}
            width="500px"
          >
            <AddTradingLogForm onCreate={onCreateTradingLog} />
          </Modal>

          {/* 투자 일지 상세 Modal */}
          <Modal
            isOpen={!!clickedTradingLog}
            onClose={handleCloseTradingLogModal}
            width="500px"
          >
            <TradingLogViewer
              diaryId={clickedTradingLog?.id ?? null}
              tradingLog={clickedTradingLog}
              onDelete={onDeleteTradingLog}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
