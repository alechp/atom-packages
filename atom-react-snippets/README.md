# atom-react-snippets
Atom React + Redux snippets (ES5, ES6, ES6+)

[![apm](https://img.shields.io/apm/v/atom-react-snippets.svg?maxAge=2592000)](https://atom.io/packages/atom-react-snippets)

## About
In addition to the common lifecycle and component snippets, Some stage-0
snippets are also included.

Example: `class property initialization`
```js
class Counter extends React.Component {
  componentWillMount = () => {
    ...
  }
  ...
}
```

Some [`Redux`](https://github.com/reactjs/redux) based skeleton structure like `reducer`,
`middleware` and `connect(component)` class snippets are also included.

## Credits
A portion of the React snippets are based off the snippets in atom [react](https://atom.io/packages/react) package.

However, due the aforementioned package and [language-babel](https://atom.io/packages/language-babel) incompatibilities and I mostly depend on the snippets, I decided to fork it out as a separate repo.

If you do not use `language-babel`, you may want to consider looking at the `react` package which includes some of the snippets in this repo.
