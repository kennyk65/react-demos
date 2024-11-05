
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

## Some JSX Rules ##

* If a JSX expression spans more than one line, you'll need to enclose it in ( ).
* A JSX expression must be a single element.  If you have multiple elements, you can enclose in <div> or <> </> tags.
* JSX expressions can be assigned to variables, returned from functions, etc.
* In JSX, you can't use the `class` attribute; instead you have to specify `className`.  This is because JSX is translated into JavaScript, and `class` is a reserved word in JS.
* When makings <li> elements or other things expected to stay in order, you usually need to give each element a `key` attribute.  Otherwise React might scramble them up on refresh.
* React components must be named beginning with a capital letter.  This will distinguish them later from regular HTML tags.

## Hooks ##

React hooks include `useState(), useEffect(), useContext(), useReducer(), useRef()` and others.

`useState()` allows for state management between renders.  Function returns 1) current state of something 2) a callback function you must call when state changes.  React will re-render whenever state changes. You (usually) must make a deep copy of the object received before applying changes because if the object reference is the same React will conclude there were no changes and will not re-render.

`useEffect()` allows you to specify an "effect function" that will be called after each render/re-render.  

```
useEffect(() => {
  alert("Something was just rendered");
});
```

If you want something to run on the first render only (when the component is first mounted), you pass in an empty array for the second argument.  The second argument is called the _dependency array_:

```
useEffect(() => {
  alert("This will display once.");
}, []);  // Because we passed an empty array.
```

The dependency array is a list of variables to check for changes.  If any variable has changed since the last effect run, we will run the effect again.  If none have changed, the effect will not run.  An empty array implicitly means nothing has changed, so the effect runs only once.  Our effect always runs the first time.

`useEffect()` is commonly used to setup event mappings, but you must remove old event mappings to prevent multiple mappings being formed.  This is done by returning a function; react will run this before re-rendering.

```
useEffect(()=>{
  document.addEventListener('keydown', handleKeyPress);
  // Specify how to clean up after the effect:
  return () => {
    document.removeEventListener('keydown', handleKeyPress);  // Called before re-render.
  };
})
```

**Rules**
* Hooks should only be called from React functions.
* Hooks should only be called from the "top level" (not inside ifs, loops, nested functions, etc.).

## CSS Style Rules ##

* A hyphen is a reserved operator in JavaScript. If we use `background-color`, the hyphen is then interpreted as a minus sign. So use `backgroundColor` instead.
* In JavaScript, style values are almost always Strings, even if the style value is really numeric.
* If you don't specify a unit for a numeric value, it is generally assumed to be "px".
  * This is 30 pixels: `{ fontSize: 30 }`
  * This is 30 ems: `{ fontSize: "2em" }`
* _Modularize_ CSS by making separate CSS for each component.  Makes it so we don't have to track down all the places a style is used.  Convention is `fileName.module.css`. Import with `import styles from './fileName.module.css'`.  _Module_ just means separate CSS file for each component.
* Don't use `class` in FSX because class is a reserve word in JS.  Use `className`.

## Forms ##

e.preventDefault(); -- use this in an onSubmit event handler to stop the form from submitting.

React has controlled and uncontrolled components.  Normal components are uncontrolled in the sense that we don't have to teach them how to hold their own state.  React likes "controlled" where each component is dumb and has to be updated all the time by useState functions and handlers..
When a <input> tag has a value attribute, it becomes "controlled" forcing you to do all the extra work.

If you want control as the keystrokes are being made, you want "controlled".  If you want to wait until the form is submitted, use "uncontrolled".

For uncontrolled, use `const numberRef = React.useRef();` to make a 'reference', then use it in input like this: `<input type="text" ref={numberRef} />`.  On form submit, for some reason we can't get the value from the form like usual, we have to say ` numberRef.current.value;`. 
For `<input type='file'`, you have to use uncontrolled.


