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

  const iterationCountLabel = screen.getByText('Total Loop count');
  const statusLabel = screen.getByText('Setting up a flow list...');

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

  const statusLabel = screen.getByText('Playing...');

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

  const statusLabel = screen.getByText('Setting up a flow list...');

  expect(statusLabel).toBeInTheDocument();
});