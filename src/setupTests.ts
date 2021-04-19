// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// // @ts-ignore
// global.renderWithRouter = (renderComponent: any, route: string) => {
//   const history = createMemoryHistory();

//   if (route) {
//     history.push(route);
//   }

//   return {
//     ...render(<HashRouter <unknown>history={history}>{renderComponent()}</HashRouter>),
//     history,
//   };
// };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
