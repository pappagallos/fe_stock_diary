import React from "react";

// 스토어
import { useGlobalStore } from "@/store";

// 타입
import { IAddTickerProps } from "./AddTickerTypes";
import { ITextFieldChangeData } from "@/components/TextField/TextFieldTypes";
import { GlobalStore } from "@/store/types";

// 컴포넌트
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";

// 스타일
import styles from "./AddTicker.module.scss";

export default function AddTicker({
  assets,
  onChangeAsset,
  onClickAddAsset,
  isPending,
  isDisabled,
  style,
}: IAddTickerProps) {
  const marketAssets = useGlobalStore(
    (state: GlobalStore) => state.marketAssets
  );
  // 자동완성을 위한 종목 티커명 리스트
  const marketAssetList = marketAssets.map((asset) => asset.ticker);

  return (
    <div className={styles.trading_tickers} style={style}>
      <table>
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="38%" />
          <col width="*" />
        </colgroup>
        <thead>
          <tr>
            <th>종목 티커명</th>
            <th>수량</th>
            <th>매수가격</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            return (
              <tr key={index}>
                <td>
                  {/* 종목 티커명 입력 필드 */}
                  <TextField
                    value={asset.ticker}
                    placeholder="ABC"
                    autoCompletionList={marketAssetList}
                    onChange={(data: ITextFieldChangeData) =>
                      onChangeAsset(index, "ticker", data.value)
                    }
                    isDisabled={isPending}
                    style={{ marginBottom: 0 }}
                  />
                </td>
                <td>
                  {/* 수량 입력 필드 */}
                  <TextField
                    value={asset.amount}
                    textAlign="right"
                    placeholder="123"
                    onChange={(data: ITextFieldChangeData) =>
                      onChangeAsset(index, "amount", data.value)
                    }
                    isDisabled={isPending}
                    style={{ marginBottom: 0 }}
                  />
                </td>
                <td>
                  {/* 매수가격 입력 필드 */}
                  <TextField
                    value={asset.buy_price}
                    textAlign="right"
                    placeholder="123"
                    onChange={(data: ITextFieldChangeData) =>
                      onChangeAsset(index, "buy_price", data.value)
                    }
                    isDisabled={isPending}
                    style={{ marginBottom: 0 }}
                  />
                </td>
                <td>
                  {/* 추가 버튼 */}
                  {index === 0 && (
                    <Button
                      value="추가"
                      className="primary"
                      onClick={onClickAddAsset}
                      isPending={isPending}
                      isDisabled={isDisabled}
                      style={{
                        display: "flex",
                        height: "46.5px",
                        padding: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
