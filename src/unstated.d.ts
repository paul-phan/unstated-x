import * as React from 'react';

export class Container<State extends object> {
    constructor(state?: object);
    state: State;
    _listeners: [Function];
    setStateSync<K extends keyof State>(
        state:
            | ((prevState: Readonly<State>) => Partial<State> | State | null)
            | (Partial<State> | State | null),
        callback?: () => void
    ): void;
    setState<K extends keyof State>(
        state:
            | ((prevState: Readonly<State>) => Partial<State> | State | null)
            | (Partial<State> | State | null),
        callback?: () => void
    ): Promise<void>;
    subscribe(fn: (changes: {}) => any): void;
    unsubscribe(fn: (changes: {}) => any): void;
}

export interface ContainerType<State extends object> {
    new (...args: any[]): Container<State>;
}

interface SubscribeProps {
    to: (ContainerType<any> | Container<any>)[];
    children(...instances: any[]): React.ReactNode;
}
interface SubscribeOneProps {
    to: (ContainerType<any> | Container<any>);
    bind: string[];
    children(...instances: any[]): React.ReactNode;
}

export class Subscribe extends React.Component<SubscribeProps> {}
export class SubscribeOne extends React.Component<SubscribeOneProps> {}

export interface ProviderProps {
    inject?: Container<any>[];
    children: React.ReactNode;
}

export const Provider: React.SFC<ProviderProps>;
