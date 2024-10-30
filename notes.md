
## Starting a new React project: ##

* Requires npm to be installed.  Npm gets installed by installing NodeJS.  I believe NodeJS is required simply because we are running JS outside of a browser.
* run: npx create-react-app name-of-app
* cd into this folder
* run: npm install
* run: npm start

The "npx" software is bundled with npm, which is installed along with Node.js.  It allows you to run packages like "create-react-app" without permanantly installing them; it just downloads package X, runs it, and discards it.  This prevents outdated version use and reduces clutter. 

You could install "create-react-app" globally by running "npm install -g create-react-app".  Then you could create a new app by running "create-react-app xxx".  Then you could delete this package by running "npm uninstall -g create-react-app"

You can find where global packages are installed by running `npm root -g`. On my windows this led to `C:\Users\kenkr\AppData\Roaming\npm\node_modules`.

When running `npm install` in a newly created app (created by running create-react-app), you may see "template" dependencies added then later removed.  These dependencies are primarily used to generate the project structure, set up default configurations, and provide initial scripts necessary for running your app.  After everything is established they are not typically needed, so they are removed.

The `package.json` file is where you can list your dependencies.  Often people specify version ranges using the *^* character, for example, `"react": "^18.3.1"` says to bring in the version of react that is >= 18.3.1 but less than 19.

When you run `npm install` this produces a `package-lock.json` file containing the actual dependencies used, including (and especially) transitive dependencies.  Having the lock file keeps the versions from shifting when you do `npm install` later, or if other people download your code.  Update the versions by running `npm update` or by deleting `package-lock.json` and running `npm install` again, but you'll have to re-test everything. 

The `npm install` process brings in a huge # of dependencies because of all the transitive dependencies.

Why does react have so many vulnerable packages

The npm install may bring in vulnerable packages, usually related to the large # of transitive dependencies.  You can get details on exactly what is vulnerable, and who uses it, but running `npm audit report`.  You can also get a really clear look at who uses which dependency by running `npm ls <package>`.  I've found that sometimes packages are used in multiple places with different versions, and this will make it really clear which version you should try to use.

Running `npm audit fix` will try to update to latest stable version based on version ranges in `package.json`.  It will update `package-lock.json` when it does this.  This might not fix anything.

Running  `npm audit fix --force` is more aggressive, including possibly updating major versions of dependencies, which is more likely to introduce breaking changes. For one thing, it can change the versions found in `package.json`, which you might not expect.  Maybe backup this file before doing the `--force` so you can see what it did.

The `--force` option is usually quite rough, so you can try to install the correct version.  `npm install [package-name]@latest` will bring this in, but is actually useless because your software will use what is in `package.json`, or actually `package-lock.json`.  Instead, alter the `package-lock.json` to have a specific dependency version you want to try.  After altering the lock file, a `npm install` will bring in the new dependency rather than the vulnerable one.  Interestingly, this will update the `package.json` with the correct dependency versions for the "tree" that uses it.  Run `npm audit report` to see if you actually fixed anything.

The problem with updating dependencies like this is you will have no idea if this has broken the dependent packages which use it.  So you will need to test.  Create a `__tests__` folder (commonly used by frameworks like Jest) and put in a class like this:

```
// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App'; // Ensure that the path to App.js is correct

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i); // Update the text based on your App component
  expect(linkElement).toBeInTheDocument();
});

```

...and run it with `npm test`.



what is "npm run eject"?  What does it mean by "this" tool?

When running "npm start", I get a message saying "One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
Compiled successfully!".  What is this message trying to say?


require (from NodeJS / CommonJS) vs import (from Ecmascript)