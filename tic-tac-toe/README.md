
https://react.dev/learn/tutorial-tic-tac-toe


Your components must start with a capital letter.
JSX can't render multiple components unless they are grouped, <> </>

In React, it’s conventional to use onSomething names for props which represent events and handleSomething for the function definitions which handle those events.

the "useState" function is critical; it 1) sets the initial state, 2) allows you to update state (2nd parameter), and 3) each time you update state it re-renders.


## Testing with Jest ##

If you separate your business logic away from your React logic, you can test these components with Jest. 

When creating a new React app with "Create React App", Jest is preconfigured in package.json (i.e., npm test).  Somehow, certain functions are made globally available in your test files.

You generally make a "__tests__" folder within the folder where your code is.  Run tests with `npm test`.

React components can be tested with the React testing library:

```
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
```

You can define a group of related tests (test suite) with the `describe()` function:

```
describe('Test suite description', () => { 
    // Individual tests go here.
} )
```

Individual tests look like this:

```
test('Individual test description`, () => {
  // Individual test logic goes here.
  expect(   ...   ).toEqual(   ...   );
  expect(   ...   ).toBe(   ...  );
```

To run some setup logic before each test you can run one of these:

```
beforeEach( () => {
    // Some setup logic
});
```

## Testing with React Testing Library ##

The React Testing Library is the main tool to verify screen interaction and behavior.

```
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
```

Tests are done with test methods,  

```
test('description of test', async () => {
  render(<Element />);
  expect(await screen.findByText(' ...text to find... ')).toBeInTheDocument();
});
```

The async/await is not always necessary, but I encountered issues with the elements not being present until rendering was finished and this was recommended.

The render() forces rendering.  The expect is the assertion.

React doesn't like you to identify elements by ID, class, or name like JQuery does.  Instead they want to access elements by "accessible names".  This means "aria-label" instead of id or name.