import React, { useState } from "react";

// 스토어
import { useGlobalStore } from "@/store";

// 타입
import {
  IAddTradingLogFormProps,
  IAddTradingLogForm,
  IAddDiaryAsset,
} from "./AddTradingLogFormTypes";
import { ITextFieldChangeData } from "@/components/TextField/TextFieldTypes";
import { GlobalStore } from "@/store/types";

// 컴포넌트
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import AddTicker from "../AddTicker/AddTicker";

// 유틸리티
import { callApi } from "@/utils/api";
import { isEmpty, isValidDate } from "@/utils/validation";

export default function AddTradingLogForm({
  onCreate, // 투자 일지 생성 완료 이벤트
}: IAddTradingLogFormProps) {
  const marketAssets = useGlobalStore(
    (state: GlobalStore) => state.marketAssets
  );

  // 투자 일지 생성 API 호출 상태 여부
  const [isPending, setIsPending] = useState(false);

  // 투자 일지 입력 폼 상태
  const [form, setForm] = useState<IAddTradingLogForm>({
    title: "",
    contents: "",
    date: "",
    assets: [
      {
        asset_id: null, // 종목 ID
        ticker: "", // 종목 티커명
        amount: "", // 종목 매입 수량
        buy_price: "", // 종목 매입 가격
      },
    ],
  });

  // 투자 일지 입력 폼 비활성화 여부
  const isDisabled =
    isEmpty(form.date) || // 날짜 내용 없음
    isEmpty(form.title) || // 제목 내용 없음
    isEmpty(form.contents) || // 내용 내용 없음
    !isValidDate(form.date); // 날짜 유효하지 않음

  /**
   * 투자 일지 입력 폼 초기화
   */
  function clearForm() {
    setForm({
      title: "",
      contents: "",
      date: "",
      assets: [{ ticker: "", amount: "", buy_price: "", asset_id: null }],
    });
  }

  /**
   * 종목 추가
   */
  function handleAddAsset() {
    if (isPending) return;

    const newAssets = [...form.assets];
    newAssets.push({
      asset_id: null,
      ticker: "",
      amount: "",
      buy_price: "",
    });
    setForm({ ...form, assets: newAssets });
  }

  /**
   * 추가할 종목 입력 값 변경 함수
   * @param index 인덱스
   * @param key 키
   * @param value 변경할 값
   */
  function onChangeAsset(
    index: number,
    key: keyof IAddDiaryAsset,
    value: string | null
  ) {
    const newAssets = [...form.assets];
    if (key !== "asset_id") newAssets[index][key] = value as string; // as는 타입 단언
    newAssets[index].asset_id =
      marketAssets.find((asset) => asset.ticker === newAssets[index].ticker)
        ?.id ?? null;
    setForm({ ...form, assets: newAssets });
  }

  /**
   * 투자 일지 입력 폼 변경 함수
   * @param key 키
   * @param value 변경할 값
   */
  function onChangeForm(
    key: keyof IAddTradingLogForm,
    value: string | IAddDiaryAsset[]
  ) {
    const newForm = { ...form };
    if (key === "assets") newForm[key] = value as IAddDiaryAsset[];
    else newForm[key] = value as string;
    setForm(newForm);
  }

  /**
   * 투자 일지 저장
   */
  async function handleSaveTradingLog() {
    if (isDisabled || isPending) return;

    try {
      setIsPending(true);
      // [1] 투자 일지 저장
      const diariesResponse = await callApi("/diaries.json", {
        method: "POST",
        body: {
          diary: form,
        },
      });
      const diariesData = await diariesResponse.json();

      // [2] 투자 일지 저장 완료 후 매매 종목 저장
      if (diariesData?.id) {
        const apiCallAssetList: Promise<Response>[] = [];
        form.assets.forEach((asset) => {
          if (asset.asset_id) {
            const body = {
              diary_asset: {
                diary_id: diariesData.id,
                asset_id: asset.asset_id,
                amount: asset.amount,
                buy_price: asset.buy_price,
              },
            };
            const api = callApi("/diary_assets.json", {
              method: "POST",
              body,
            });
            apiCallAssetList.push(api);
          }
        });
        // [3] 매매 종목 한 번에 저장
        if (apiCallAssetList.length > 0) await Promise.all(apiCallAssetList);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsPending(false);
      onCreate({ useLoading: false });
      clearForm();
    }
  }

  return (
    <>
      <TextField
        value={form.date}
        label="투자 날짜"
        placeholder="YYYY-MM-DD"
        checkFormatter={(value) => isEmpty(value) || isValidDate(value)}
        onChange={(data: ITextFieldChangeData) =>
          onChangeForm("date", data.value)
        }
        isDisabled={isPending}
      />
      <TextField
        value={form.title}
        label="투자 일지 제목"
        placeholder="투자 일지 제목을 입력해주세요."
        onChange={(data: ITextFieldChangeData) =>
          onChangeForm("title", data.value)
        }
        isDisabled={isPending}
      />
      <Textarea
        value={form.contents}
        label="투자 일지 내용"
        placeholder="투자 일지 내용을 입력해주세요."
        onChange={(value) => onChangeForm("contents", value)}
        isDisabled={isPending}
      />
      <AddTicker
        assets={form.assets}
        onChangeAsset={onChangeAsset}
        onClickAddAsset={handleAddAsset}
        isPending={isPending}
      />
      <Button
        value="투자 일지 저장"
        className="primary"
        onClick={handleSaveTradingLog}
        isPending={isPending}
        isDisabled={isDisabled}
        style={{ marginTop: "20px" }}
      />
    </>
  );
}
