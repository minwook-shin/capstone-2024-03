import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrimaryAppBar from "../components/PrimaryAppBar";

test("renders PrimaryAppBar component with all buttons", () => {
  render(<PrimaryAppBar />);

  const downloadButton = screen.getByRole("button", {
    name: /시나리오에서 스크린샷 내려받기/i,
  });
  expect(downloadButton).toBeInTheDocument();

  const textResultButton = screen.getByRole("button", {
    name: /시나리오에서 추출한 텍스트 결과보기/i,
  });
  expect(textResultButton).toBeInTheDocument();

  const refreshButton = screen.getByRole("button", {
    name: /안드로이드 화면 새로고침/i,
  });
  expect(refreshButton).toBeInTheDocument();

  const helpButton = screen.getByRole("button", { name: /도움말 확인/i });
  expect(helpButton).toBeInTheDocument();
});

test("clicking on the help button should call the setRun function", () => {
  const setRunMock = jest.fn();
  render(<PrimaryAppBar setRun={setRunMock} />);

  const helpButton = screen.getByRole("button", { name: /도움말 확인/i });
  fireEvent.click(helpButton);

  expect(setRunMock).toHaveBeenCalledTimes(1);
});
