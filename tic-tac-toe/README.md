
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


## Testing with Cypress ##

Cypress is an end-to-end testing library that overlaps a bit with the capabilities of the React testing library.

Install Cypress (for test/dev purposes only by running) `npm install cypress --save-dev`.  Add some scripts to package.json for running Cypress:

```
  "scripts": {
    ...
    "cypress:open": "cypress open",       
    "cypress:run": "cypress run"         
  },
```

The `cypress open` opens a GUI tool which is useful for watching / debugging your tests.  `cypress run` is what you ultimately use when running the tests from npm with `npm run cypress:run`.

When you run `npx cypress open` for the first time in your project root, it will setup all needed Cypress config files and open a GUI.  The GUI app will initially show errors because it does not know where your app is running.  Fix this by editing the `cypress.config.js` file and adding:

```
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    ...
  },
});

```

You place your Cypress-based test files in a `/cypress/e2e` folder. The js files don't need the usual imports since they run within a provided environment.

```
describe('Game E2E', () => {
    it('should allow players to complete a game', () => {
      cy.visit('/');
      cy.contains('Next player: X');
  
      // Simulate X and O moves
      cy.get('.square').eq(0).click();
      cy.contains('Next player: O');
      cy.get('.square').eq(1).click();
      cy.contains('Next player: X');
      cy.get('.square').eq(4).click();
      cy.get('.square').eq(5).click();
      cy.get('.square').eq(8).click();
  
      // Verify that X won
      cy.contains('Winner: X');
    });
  });
  
```

* describe() - Same meaning as seen in other tests
* it() - I believe means "integration test"
* cy.visit() - Causes the test to navigate to the URL path specified
* cy.contains() - See if given text exists on the page
* cy.get() - Retrieves DOM elements by selector.  .eq() seems to select an iteration from an array.  .click() clicks.


## Some JSX Rules ##

* If a JSX expression spans more than one line, you'll need to enclose it in ( ).
* A JSX expression must be a single element.  If you have multiple elements, you can enclose in <div> or <> </> tags.
* JSX expressions can be assigned to variables, returned from functions, etc.
* In JSX, you can't use the `class` attribute; instead you have to specify `className`.  This is because JSX is translated into JavaScript, and `class` is a reserved word in JS.
* When makings <li> elements or other things expected to stay in order, you usually need to give each element a `key` attribute.  Otherwise React might scramble them up on refresh.