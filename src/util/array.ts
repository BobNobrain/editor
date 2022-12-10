/**
 * Creates a predicate to filter an array so that result will only contain items
 * that came before `value` in that array.
 * @param value Value to search for
 * @returns Predicate to feed into Array::filter method
 *
 * @example
 * console.log(
 *    ['apple', 'orange', 'grape', 'banana']
 *        .filter(untilMet('orange'))
 * ); // ['apple', 'orange']
 */
export const untilMet = <T>(value: T) => {
    let met = false;
    return (item: T): boolean => {
        if (item === value) {
            met = true;
            return false;
        }

        return !met;
    };
};
