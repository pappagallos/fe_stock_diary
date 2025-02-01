import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "@/components/Button/Button";
import styles from "@/components/Button/Button.module.scss";

describe("<Button /> 컴포넌트 테스트", () => {
  it("<Button /> 컴포넌트의 value 속성이 있으면 버튼 텍스트가 표시된다.", () => {
    const { container } = render(<Button value="로그인" onClick={() => {}} />);
    expect(container).toHaveTextContent("로그인"); // toHaveTextContent: Element 내부의 텍스트 확인, e.g.) <button>로그인</button>의 "로그인"
  });

  it("<Button /> 컴포넌트의 onClick 속성이 있으면 클릭 이벤트가 발생한다.", async () => {
    const onClick = jest.fn();
    render(<Button value="로그인" onClick={onClick} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("<Button /> 컴포넌트의 isPending 속성이 있으면 pending 스타일이 적용된다.", async () => {
    render(<Button value="로그인" onClick={() => {}} isPending={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(styles.pending);
  });

  it("<Button /> 컴포넌트의 isDisabled 속성이 있으면 disabled 스타일이 적용된다.", async () => {
    render(<Button value="로그인" onClick={() => {}} isDisabled={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(styles.disabled);
  });

  // it("<Button /> 컴포넌트에 커서를 올리면 hover 스타일이 적용된다.", async () => {
  //   render(<Button value="로그인" onClick={() => {}} />);
  //   const button = screen.getByRole("button");
  //   await userEvent.hover(button); // 커서를 올리는 이벤트
  //   // styled-components 스타일을 사용하지 않고 있어서 :hover 같은 pseudo-class 스타일을 확인하기 어려워 computedStyle을 사용해서 확인해야 한다.
  //   const styles = window.getComputedStyle(button, ":hover");
  //   expect(styles.opacity).toBe("0.9"); // 커서를 올리면 hover 스타일이 적용된다.
  // });

  // it("<Button /> 컴포넌트를 클릭하면 active 스타일이 적용된다.", async () => {
  //   render(<Button value="로그인" onClick={() => {}} />);
  //   const button = screen.getByRole("button");
  //   await userEvent.click(button); // 클릭 이벤트
  //   const styles = getComputedStyle(button, ":active");
  //   expect(styles.transform).toBe("scale(0.98)"); // 클릭하면 active 타일이 적용된다.
  // });
});
