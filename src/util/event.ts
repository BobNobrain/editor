export type Listener<Payload> = (payload: Payload) => void;

export interface Listenable<Payload> {
    on(listener: Listener<Payload>): number;
    off(listenerId: number): void;
}

export interface Triggerable<Payload> {
    trigger(value: Payload): void;
}

export interface Event<Payload> extends Listenable<Payload>, Triggerable<Payload> {}

export function createEvent<Payload>(): Event<Payload> {
    let seq = 0;
    const listenersById: Record<number, Listener<Payload>> = {};

    const on = (l: Listener<Payload>) => {
        const id = ++seq;
        listenersById[id] = l;
        return id;
    };
    const off = (lid: number) => {
        delete listenersById[lid];
    };
    const trigger = (payload: Payload) => {
        for (const l of Object.values(listenersById)) {
            l(payload);
        }
    };

    return { on, off, trigger };
}
