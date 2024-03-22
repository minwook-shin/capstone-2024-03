import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionInput from '../OptionInput';

test('renders OptionInput component with input fields and select dropdown', () => {
  const inputValues = {
    key_event: 'keydown',
    functions: '',
    otherInput: 'Some value',
  };

  const onInputChange = jest.fn();
  const onInputConfirm = jest.fn();
  const onInputCancel = jest.fn();

  render(
    <OptionInput
      inputValues={inputValues}
      onInputChange={onInputChange}
      onInputConfirm={onInputConfirm}
      onInputCancel={onInputCancel}
    />
  );

  const selectDropdown = screen.getByRole('combobox');

  expect(selectDropdown).toBeInTheDocument();
});
