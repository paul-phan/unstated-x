import React, { createContext } from 'react';

export const StateContext = createContext(null);

export class Container {
  state = {};
  _listeners = [];

  constructor(state = {}) {
    this.state = state;
  }

  _setState = (updater, callback) => {
    let nextState;

    if (typeof updater === 'function') {
      nextState = updater(this.state);
    } else {
      nextState = updater;
    }

    if (nextState == null) {
      if (callback) callback();
    }
    return nextState;
  };

  setStateSync = (updater, callback) => {
    const nextState = this._setState(updater, callback);

    this.state = Object.assign({}, this.state, nextState);

    this._listeners.forEach(fn => fn(nextState));
  };

  setState = (updater, callback) => {
    return Promise.resolve().then(() => {
      const nextState = this._setState(updater, callback);

      this.state = Object.assign({}, this.state, nextState);

      let promises = this._listeners.map(listener => listener(nextState));

      return Promise.all(promises).then(() => {
        if (callback) {
          return callback();
        }
      });
    });
  };

  subscribe(fn) {
    this._listeners.push(fn);
  }

  unsubscribe(fn) {
    this._listeners = this._listeners.filter(f => f !== fn);
  }
}

const DUMMY_STATE = {};

export class Subscribe extends React.Component {
  state = {};
  instances = [];
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
    this._unsubscribe();
  }

  _unsubscribe() {
    this.instances.forEach(container => {
      container.unsubscribe(this.onUpdate);
    });
  }

  onUpdate = () => {
    return new Promise(resolve => {
      if (!this.unmounted) {
        this.setState(DUMMY_STATE, resolve);
      } else {
        resolve();
      }
    });
  };

  _createInstances(map, containers) {
    this._unsubscribe();

    if (map === null) {
      throw new Error(
        'You must wrap your <Subscribe> components with a <Provider>'
      );
    }

    let safeMap = map;
    let instances = containers.map(ContainerItem => {
      let instance;

      if (
        typeof ContainerItem === 'object' &&
        ContainerItem instanceof Container
      ) {
        instance = ContainerItem;
      } else {
        instance = safeMap.get(ContainerItem);

        if (!instance) {
          instance = new ContainerItem();
          safeMap.set(ContainerItem, instance);
        }
      }

      instance.unsubscribe(this.onUpdate);
      instance.subscribe(this.onUpdate);

      return instance;
    });

    this.instances = instances;
    return instances;
  }

  render() {
    return (
      <StateContext.Consumer>
        {map =>
          Reflect.apply(
            this.props.children,
            null,
            this._createInstances(map, this.props.to)
          )
        }
      </StateContext.Consumer>
    );
  }
}

export class SubscribeOne extends React.Component {
  state = {};
  instance = null;
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
    this._unsubscribe();
  }

  _unsubscribe() {
    this.instance && this.instance.unsubscribe(this.onUpdate);
  }

  onUpdate = changedState => {
    return new Promise(resolve => {
      if (
        !this.unmounted &&
        Array.isArray(this.props.bind) &&
        Object.keys(changedState).filter(key => this.props.bind.includes(key))
          .length > 0
      ) {
        this.setState(DUMMY_STATE, resolve);
      } else {
        resolve();
      }
    });
  };

  _createInstance(map, container) {
    this._unsubscribe();
    if (map === null) {
      throw new Error(
        'You must wrap your <Subscribe> components with a <Provider>'
      );
    }
    let safeMap = map;
    if (typeof container === 'object' && container instanceof Container) {
      this.instance = container;
    } else {
      this.instance = safeMap.get(container);

      if (!this.instance) {
        this.instance = new container();
        safeMap.set(container, this.instance);
      }
    }

    this.instance.unsubscribe(this.onUpdate);
    this.instance.subscribe(this.onUpdate);

    return this.instance;
  }

  render() {
    return (
      <StateContext.Consumer>
        {map => this.props.children(this._createInstance(map, this.props.to))}
      </StateContext.Consumer>
    );
  }
}

export function Provider(props) {
  return (
    <StateContext.Provider value={new Map()}>
      {props.children}
    </StateContext.Provider>
  );
}
