import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlowList from '../FlowList';

test('renders FlowList component with initial state', () => {
  render(<FlowList taskItems={[]} initialTaskItems={[]} />);

  expect(screen.getByText('Run Flow')).toBeInTheDocument();
  expect(screen.getByText('Clear Flow')).toBeInTheDocument();
});


test('allows running the flow items', async () => {
  const flowItems = [
    { id: 1, text: 'Task 1', time: 1000 },
    { id: 2, text: 'Task 2', time: 2000 },
    { id: 3, text: 'Task 3', time: 3000 },
  ];

  render(<FlowList taskItems={[]} initialTaskItems={[]} flowItems={flowItems} />);

  fireEvent.click(screen.getByText('Run Flow'));

  await waitFor(() => {
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });
});
