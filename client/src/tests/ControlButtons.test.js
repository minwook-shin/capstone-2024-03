import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ControlButtons from '../ControlButtons';

test('renders ControlButtons component with buttons and label', () => {
  render(<ControlButtons />);

  const downloadButton = screen.getByText('Download Saved ScreenShot');
  const installButton = screen.getByText('Install Keyboard');
  const resetButton = screen.getByText('Reset Keyboard');

  expect(downloadButton).toBeInTheDocument();
  expect(installButton).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
});
