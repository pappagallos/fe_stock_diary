import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CircleButton from "@/components/CircleButton/CircleButton";

describe("<CircleButton /> 컴포넌트 테스트", () => {
  it("<CircleButton /> 컴포넌트의 children 속성이 있으면 버튼 텍스트가 표시된다.", () => {
    const { container } = render(<CircleButton>테스트</CircleButton>);
    expect(container).toHaveTextContent("테스트");
  });

  it("<CircleButton /> 컴포넌트의 onClick 속성이 있으면 클릭 이벤트가 발생한다.", async () => {
    const onClick = jest.fn();
    render(<CircleButton onClick={onClick}></CircleButton>);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
