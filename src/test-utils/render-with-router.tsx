import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: any, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  console.log('#DH# ui', ui);
  return render(ui, { wrapper: BrowserRouter });
};
