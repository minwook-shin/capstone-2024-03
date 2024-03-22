import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';

test('renders TaskList component with task items', () => {
  const taskItems = [
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
    { id: 3, text: 'Task 3' },
  ];

  render(<TaskList taskItems={taskItems} />);


  const taskListItems = screen.getAllByRole('listitem');
  expect(taskListItems).toHaveLength(taskItems.length);

  taskListItems.forEach((item, index) => {
    expect(item).toHaveTextContent(taskItems[index].text);
  });
});

test('draggable attribute is set on task list items', () => {
  const taskItems = [
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
    { id: 3, text: 'Task 3' },
  ];

  render(<TaskList taskItems={taskItems} />);
  
  const taskListItems = screen.getAllByRole('listitem');
  taskListItems.forEach((item) => {
    expect(item).toHaveAttribute('draggable');
  });
});