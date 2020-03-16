import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getAllByText } = render(<App />);
  const title = getAllByText('Beer 4 Your Buck');
  expect(title[0]).toBeInTheDocument();
});
