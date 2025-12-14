import { render } from '@testing-library/react';
import App from './App';
import LoginState from './context/LoginContext';

test('renders app without crashing', () => {
  render(
    <LoginState>
      <App />
    </LoginState>
  );

  expect(true).toBe(true);
});
