// @flow
import React from 'react';
import { render } from 'react-dom';
import { Container, Provider, SubscribeOne } from '../src/unstated';

type CounterState = {
  count: number
};

class AppContainer extends Container<CounterState> {
  state = {};
}

function App() {
  return (
    <div>
      Open React DevTools => Highlight updates to check result
      <SubscribeOne to={AppContainer} bind={['test']}>
        {app => (
          <div>
            Subscribe to only one state property:: {app.state.test}
            <div>
              <input
                onChange={e => app.setStateSync({ test: e.target.value })}
                value={app.state.test || ''}
              />
            </div>
          </div>
        )}
      </SubscribeOne>
      <SubscribeOne to={AppContainer} bind={['test1']}>
        {app => (
          <div>
            Subscribe to only one state property:: {app.state.test1}
            <div>
              <input
                onChange={e => app.setStateSync({ test1: e.target.value })}
                value={app.state.test1 || ''}
              />
            </div>
          </div>
        )}
      </SubscribeOne>
      <SubscribeOne to={AppContainer} bind={['test2']}>
        {app => (
          <div>
            Subscribe to only one state property:: {app.state.test2}
            <div>
              <input
                onChange={e => app.setStateSync({ test2: e.target.value })}
                value={app.state.test2 || ''}
              />
            </div>
          </div>
        )}
      </SubscribeOne>
    </div>
  );
}

render(
  <Provider>
    <App />
  </Provider>,
  window.single
);
