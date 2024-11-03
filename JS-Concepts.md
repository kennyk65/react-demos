## Required JavaScript Concepts ##

* Arrow Functions
* Destructors
* Spread Operators
* this
* Promise
* Template literals

## Template Literal ##

A quick way to do a lot of string concatenation.  Example:

```
const count = 5;
const message = `Count is ${count}`;
console.log(message);  // Displays "Count is 5"
```



Function Declarations (traditional) vs "arrow" functions:

The traditional function handles `this` differently than the "arrow" function.  See the following example:

* Traditional functions use "dynamic scoping".  This is determined by how the function is called, not where it is defined:

```
function traditionalFunction() {
    console.log(this);
}

const obj = { traditionalFunction };

obj.traditionalFunction(); // `this` is `obj`
traditionalFunction();     // `this` is the global object (or `undefined` in strict mode)

```

* Arrow functions use lexical scoping for `this`. It is inherited from surrounding context, not how or where the function is called.



```
const value = 84;

const obj = {
  value: 42,
  regularFunction: function() {
    console.log(this.value); // `this` refers to `obj`
    console.log(value); // refers to 84
  },
  arrowFunction: () => {
    console.log(this.value); // `this` is lexically scoped and refers to the global scope, not `obj`
    console.log(value); // `this` is lexically scoped and refers to the global scope, not `obj`
  },
};

obj.regularFunction(); // Logs: 42 and 84
obj.arrowFunction();   // Logs: undefined (because `this` does not refer to `obj`) and 84
```

## `this` in JavaScript` ##

`this` works differently depending on what kind of function is using it, and HOW it is invoked.  Very confusing.


**Standalone Function Invocation** In a traditional JS function not defined within anything else, `this` refers to global object which is undefined in non-strict mode: 
```
const standaloneFunction = function() {
  console.log(this.value); // In non-strict mode, this will log `undefined`
};
standaloneFunction(); // Logs: undefined
```

**Method Invocation** When a traditional function defined inside an object is called, it is called "method invocation".  In this case, `this` refers to obj, even though objects "don't have their own scope":
```
const obj = {
  value: 42,
  method: function() {
    console.log(this.value); // `this` refers to `obj`
  }
};
obj.method(); // Logs: 42
```

**Constructor Invocation** This function created with `new` is really an object.  Works just like above:
```
function ConstructorFunction() {
  this.value = 100; // `this` refers to the new instance
}
const instance = new ConstructorFunction();
console.log(instance.value); // Logs: 100
```

**Arrow Functions Inside {} Objects** : Arrow functions capture `this` from "surrounding context".  However, objects defined with {} doesn't count as surrounding context.  This causes `this` to refer its surrounding context, which is usually global or undefined:
```
const obj2 = {
  value: 20,
  arrowMethod: () => {
    console.log(this.value); // `this` does NOT refer to `obj2`
  }
  method: function() {
    console.log(this.value); // `this` refers to `obj`
  }
};
obj2.method(); // Logs: 42
obj2.arrowMethod(); // Logs: undefined (or the global value if outside a module)
```

**Arrow Function inside traditional function**  `this` would refer to the function inside which the arrow function is defined. 
```
const outerValue = 10;

const outerFunction = function() {
  this.outerValue = 20; // `this` refers to the global object (or undefined in strict mode)

  const innerArrowFunction = () => {
    console.log(this.outerValue); // `this` refers to the context of `outerFunction`
  };

  innerArrowFunction(); // Logs: 20
};
outerFunction(); // Calls the outer function
```

**Functions in a Class** Behave in a more Java like way:
```
class MyClass {
  constructor() {
    this.value = 'Hello';
  }
  regularMethod() {
    console.log(this.value); // `this` refers to the instance of MyClass.
  }  
  arrowMethod: () => {
    console.log(this.value); // `this` refers to the instance of MyClass because it's lexically inherited.
  }
};

const myObj = new MyClass();
myObj.regularMethod();      // Logs: 'Hello'
myObj.arrowMethod();        // Logs: 'Hello'
```

