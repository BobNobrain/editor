export interface ClassesSet {
    has(value: string): boolean;
    add(value: string): void;
    delete(value: string): void;
    toggle(value: string): boolean;
}

class ClassesSetImpl extends Set<string> implements ClassesSet {
    toggle(value: string): boolean {
        if (this.has(value)) {
            this.delete(value);
            return false;
        }

        this.add(value);
        return true;
    }
}

export function createClassesSet(): ClassesSet {
    return new ClassesSetImpl();
}
