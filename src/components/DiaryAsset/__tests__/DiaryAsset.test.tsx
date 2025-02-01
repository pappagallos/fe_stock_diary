import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiaryAsset from "@/components/DiaryAsset/DiaryAsset";

// DELETE 할 때 실제 API를 호출하지 않도록 @/utils/api의 callApi 함수를 모킹
// callApi 함수는 항상 resolve 되도록 하기 위해 모킹되어서 API 호출이 성공되었다고 가정하는 것
jest.mock("@/utils/api", () => ({
  callApi: jest.fn(() => Promise.resolve()),
}));

describe("<DiaryAsset /> 컴포넌트 테스트", () => {
  it("<DiaryAsset /> 컴포넌트의 assetName 속성이 있으면 자산 이름이 표시된다.", () => {
    render(
      <DiaryAsset
        assetId={1}
        assetName="테스트"
        purchasePrice={123}
        currentPrice={987}
        profitRate={123.45}
        onDelete={() => {}}
      />
    );
    const diaryAsset = screen.getByRole("listitem");
    const tickerName = diaryAsset.querySelector(
      ".ticker_name span"
    ) as HTMLSpanElement;
    expect(tickerName.textContent).toBe("테스트");
  });

  it("<DiaryAsset /> 컴포넌트의 purchasePrice 속성이 있으면 매수가가 표시된다.", () => {
    render(
      <DiaryAsset
        assetId={1}
        assetName="테스트"
        purchasePrice={123456}
        currentPrice={987654}
        profitRate={123.45}
        onDelete={() => {}}
      />
    );
    const diaryAsset = screen.getByRole("listitem");
    const purchasePrice = diaryAsset.querySelector(
      ".ticker_item:nth-child(2) .value"
    ) as HTMLParagraphElement;
    expect(purchasePrice.textContent).toBe("123,456원");
  });

  it("<DiaryAsset /> 컴포넌트의 currentPrice 속성이 있으면 현재가가 표시된다.", () => {
    render(
      <DiaryAsset
        assetId={1}
        assetName="테스트"
        purchasePrice={123456}
        currentPrice={987654}
        profitRate={123.45}
        onDelete={() => {}}
      />
    );
    const diaryAsset = screen.getByRole("listitem");
    const currentPrice = diaryAsset.querySelector(
      ".ticker_item:nth-child(3) .value"
    ) as HTMLParagraphElement;
    expect(currentPrice.textContent).toBe("987,654원");
  });

  it("<DiaryAsset /> 컴포넌트의 profitRate 속성이 있으면 수익률이 표시된다.", () => {
    render(
      <DiaryAsset
        assetId={1}
        assetName="테스트"
        purchasePrice={123456}
        currentPrice={987654}
        profitRate={123.45}
        onDelete={() => {}}
      />
    );
    const diaryAsset = screen.getByRole("listitem");
    const profitRate = diaryAsset.querySelector(
      ".ticker_item:nth-child(4) .value"
    ) as HTMLParagraphElement;
    expect(profitRate.textContent).toBe("123.45%");
  });

  it("<DiaryAsset /> 컴포넌트의 onDelete 속성이 있으면 삭제 이벤트가 호출된다.", async () => {
    const onDelete = jest.fn();
    render(
      <DiaryAsset
        assetId={1}
        assetName="테스트"
        purchasePrice={123456}
        currentPrice={987654}
        profitRate={123.45}
        onDelete={onDelete}
      />
    );
    const diaryAssetDeleteButton = screen.getByTestId("delete-button");
    await userEvent.click(diaryAssetDeleteButton);
    // handleClickDelete 함수 내부에서는 callApi 함수를 호출하고 그 안에서 props.onDelete 함수가 호출되는데 그게 바로 jest.fn() 함수이다.
    // callApi 함수는 항상 resolve 되도록 모킹되어서 API 호출이 성공되었다고 가정하기 때문에 onDelete 함수가 반드시 호출되어야 한다.
    expect(onDelete).toHaveBeenCalled();
  });
});
