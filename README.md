# Unstated-x

> State so simple, it goes without saying

## Installation

```sh
yarn add unstated-x
```

## About Unstated

The original documentation can be found in: https://github.com/jamiebuilds/unstated

## Additional Functions

> Fix broken Controlled Component when using Asynchronous Unstated `setState` by using `setStateSync`

```js
function App() {
  return (
    <Subscribe to={[AppContainer]}>
      {app => (
        <input
          onChange={e => app.setStateSync({ value: e.target.value })}
          value={app.state.value}
        />
      )}
    </Subscribe>
  );
}
```

> Add Subscribe to only one Container and only state you want to:

```js
function App() {
  return (
    <SubscribeOne to={AppContainer} bind={['value']}>
      {app => (
        <div>
          This will update only if the "value" state is updated, others will not
          <input
            onChange={e => app.setStateSync({ value: e.target.value })}
            value={app.state.value}
          />
        </div>
      )}
    </SubscribeOne>
  );
}
```

You can checkout the example to see more.

> In this version, if you use React version 16.3 or higher, it will use the native React.createContext rather than the `create-react-context` library. I also removed support for multiple `<Provider />` it clearly unnecessary.

## Contribution

Feel free to create issues/pull request, I will eager to apply it to unstated-x if it good enough :)
