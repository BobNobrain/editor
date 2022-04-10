export type Just<T> = { value: T };
export type Nothing = null;
export type Maybe<T> = Nothing | Just<T>;

export namespace Maybe {
    export const just = <T>(value: T): Just<T> => ({ value });
    export const nothing: Nothing = null;

    export const map = <T, U>(m: Maybe<T>, f: (t: T) => U): Maybe<U> => m && { value: f(m.value) };
    export const bind = <T, U>(m: Maybe<T>, f: (t: T) => Maybe<U>): Maybe<U> => m && f(m.value);
}


