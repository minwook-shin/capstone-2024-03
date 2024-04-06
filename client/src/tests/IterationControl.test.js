import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IterationControl from '../IterationControl';

test('renders IterationControl component with initial values', () => {
  const repeatCount = 5;
  const setRepeatCount = jest.fn();
  const currentCount = 3;
  const isPlaying = false;

  render(
    <IterationControl
      repeatCount={repeatCount}
      setRepeatCount={setRepeatCount}
      currentCount={currentCount}
      isPlaying={isPlaying}
    />
  );

  const iterationCountLabel = screen.getByText('총 반복 횟수 :');
  const statusLabel = screen.getByText('시나리오 실행 대기하는 중...');

  expect(iterationCountLabel).toBeInTheDocument();
  expect(statusLabel).toBeInTheDocument();
});

test('displays "Playing..." when isPlaying is true', () => {
  const repeatCount = 5;
  const setRepeatCount = jest.fn();
  const currentCount = 3;
  const isPlaying = true;

  render(
    <IterationControl
      repeatCount={repeatCount}
      setRepeatCount={setRepeatCount}
      currentCount={currentCount}
      isPlaying={isPlaying}
    />
  );

  const statusLabel = screen.getByText('재생하는 중...');

  expect(statusLabel).toBeInTheDocument();
});

test('displays "Setting up a flow list..." when isPlaying is false', () => {
  const repeatCount = 5;
  const setRepeatCount = jest.fn();
  const currentCount = 3;
  const isPlaying = false;

  render(
    <IterationControl
      repeatCount={repeatCount}
      setRepeatCount={setRepeatCount}
      currentCount={currentCount}
      isPlaying={isPlaying}
    />
  );

  const statusLabel = screen.getByText('시나리오 실행 대기하는 중...');

  expect(statusLabel).toBeInTheDocument();
});