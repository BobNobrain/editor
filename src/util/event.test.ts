import { createEvent, Listener } from './event';

describe('Event', () => {
    it('calls all listeners', () => {
        const l1: Listener<void> = jest.fn();
        const l2: Listener<void> = jest.fn();

        const evt = createEvent<void>();
        evt.on(l1);
        evt.on(l2);
        evt.on(l1);

        evt.trigger();

        expect(l1).toBeCalledTimes(2);
        expect(l2).toBeCalledTimes(1);
    });

    it('does not call unsubscribed listeners', () => {
        const l1: Listener<void> = jest.fn();
        const l2: Listener<void> = jest.fn();
        const l3: Listener<void> = jest.fn();

        const evt = createEvent<void>();
        evt.on(l1);
        evt.on(l2);
        evt.off(evt.on(l1));
        evt.off(evt.on(l3));

        evt.trigger();

        expect(l1).toBeCalledTimes(1);
        expect(l2).toBeCalledTimes(1);
        expect(l3).toBeCalledTimes(0);
    });
});
