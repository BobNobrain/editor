import { HumanString } from '../../util/HumanString';

export class InvalidActionError extends Error {
    public action: HumanString;

    constructor(msg: string, action: HumanString) {
        super(msg);

        this.action = {
            nameId: action.nameId,
            nameData: action.nameData,
        };
    }
}
