import { useState } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TextField from "@/components/TextField/TextField";

describe("<TextField /> 컴포넌트 테스트", () => {
  it("<TextField /> 컴포넌트의 value 속성이 있으면 입력 값이 표시된다.", () => {
    const onChange = jest.fn();
    render(<TextField value={"테스트"} onChange={onChange} />);
    const textField = screen.getByRole("input") as HTMLInputElement;
    expect(textField.value).toBe("테스트");
  });

  it("<TextField /> 컴포넌트의 onChange 속성이 있으면 입력 값이 변경된다.", async () => {
    // Input 컴포넌트 상태 변경 테스트를 진행하려면 다음과 같이 컴포넌트로 만들어 준 후 진행해야함
    const TextFieldComponent = () => {
      const [value, setValue] = useState("테스트");
      return (
        <TextField value={value} onChange={(data) => setValue(data.value)} />
      );
    };
    render(<TextFieldComponent />);
    const textField = screen.getByRole("input") as HTMLInputElement;
    await userEvent.clear(textField); // "테스트"가 이미 입력되어 있기 때문에 입력 값을 초기화해주어야 함
    await userEvent.type(textField, "테스트2");
    expect(textField.value).toBe("테스트2");
  });

  it("<TextField /> 컴포넌트의 label이 정상적으로 표시된다.", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <TextField label="라벨" value="테스트" onChange={onChange} />
    );
    const label = container.querySelector(".label");
    expect(label).toHaveTextContent("라벨");
  });

  it("<TextField /> 컴포넌트의 placeholder가 정상적으로 표시된다.", async () => {
    const onChange = jest.fn();
    render(
      <TextField
        placeholder="플레이스홀더"
        value="테스트"
        onChange={onChange}
      />
    );
    const placeholder = screen.getByPlaceholderText("플레이스홀더"); // placeholder 속성 값이 "플레이스홀더"인 대상을 찾음
    expect(placeholder).toBeInTheDocument(); // placeholder 속성 값이 "플레이스홀더"인 대상이 존재하는지 확인
  });

  it("<TextField /> 컴포넌트의 textAlign이 정상적으로 표시된다.", async () => {
    const onChange = jest.fn();
    // render를 여러번 쓰면 컴포넌트가 추가되기 때문에 컴포넌트를 리렌더링하려면 render 함수에서 반환하는 rerender 함수를 사용해야 함
    const { rerender } = render(
      <TextField textAlign="center" value="테스트" onChange={onChange} />
    );
    const centerTextField = screen.getByRole("input") as HTMLInputElement;
    expect(centerTextField).toHaveStyle("text-align: center;");

    rerender(<TextField textAlign="left" value="테스트" onChange={onChange} />);
    const leftTextField = screen.getByRole("input") as HTMLInputElement;
    expect(leftTextField).toHaveStyle("text-align: left;");

    rerender(
      <TextField textAlign="right" value="테스트" onChange={onChange} />
    );
    const rightTextField = screen.getByRole("input") as HTMLInputElement;
    expect(rightTextField).toHaveStyle("text-align: right;");
  });

  it("<TextField /> 컴포넌트의 autoCompletionList가 정상적으로 표시된다.", async () => {
    const autoCompletionList = ["AAPL", "AMZN", "GOOGL", "MSFT"];
    const TextFieldComponent = () => {
      const [value, setValue] = useState("");
      return (
        <TextField
          value={value}
          autoCompletionList={autoCompletionList}
          onChange={(data) => setValue(data.value)}
        />
      );
    };
    render(<TextFieldComponent />);

    const textField = screen.getByRole("input") as HTMLInputElement;
    await userEvent.type(textField, "AAPL");

    const list = screen.getByRole("listbox");
    const listItems = list.querySelectorAll("li[role='listitem']");
    listItems.forEach((item) => {
      expect(item).toHaveTextContent("AAPL");
      expect(item).not.toHaveTextContent("AMZN");
      expect(item).not.toHaveTextContent("GOOGL");
      expect(item).not.toHaveTextContent("MSFT");
    });
  });

  it("<TextField /> 컴포넌트의 isDisabled가 true일 경우 입력 값이 변경되지 않는다.", async () => {
    const onChange = jest.fn();
    render(<TextField isDisabled={true} value="테스트" onChange={onChange} />);
    const textField = screen.getByRole("input") as HTMLInputElement;
    await userEvent.type(textField, "테스트2");
    expect(textField.value).toBe("테스트");
  });

  it("<TextField /> 컴포넌트의 checkFormatRegex이 존재할 경우 입력 값이 정상적으로 검증된다.", async () => {
    const TextFieldComponent = () => {
      const [value, setValue] = useState("");
      return (
        <TextField
          value={value}
          checkFormatRegex="^\d{4}\.\s\d{2}\.\s\d{2}\.$"
          onChange={(data) => setValue(data.value)}
        />
      );
    };
    render(<TextFieldComponent />);

    const textField = screen.getByRole("input") as HTMLInputElement;
    const textboxField = screen.getByRole("textbox") as HTMLDivElement;

    await userEvent.type(textField, "2024.12.31.");
    expect(textboxField).toHaveClass("error");

    await userEvent.clear(textField);
    await userEvent.type(textField, "2024. 12. 31.");
    expect(textboxField).not.toHaveClass("error");
  });

  it("<TextField /> 컴포넌트의 checkFormatter가 존재할 경우 입력 값이 정상적으로 검증된다.", async () => {
    const TextFieldComponent = () => {
      const [value, setValue] = useState("");
      return (
        <TextField
          value={value}
          checkFormatter={(value) => value.length === 10}
          onChange={(data) => setValue(data.value)}
        />
      );
    };
    render(<TextFieldComponent />);

    const textField = screen.getByRole("input") as HTMLInputElement;
    const textboxField = screen.getByRole("textbox") as HTMLDivElement;

    await userEvent.type(textField, "아파트아파트아파트아파트");
    expect(textboxField).toHaveClass("error");

    await userEvent.clear(textField);
    await userEvent.type(textField, "아파트아파트아파트아");
    expect(textboxField).not.toHaveClass("error");
  });
});
