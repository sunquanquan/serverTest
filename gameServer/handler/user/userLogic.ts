import { UserMainLogic } from "../userMainLogic";
import { BaseLogic } from "../baseLogic";

export class UserLogic extends BaseLogic {
    constructor(userMainLogic: UserMainLogic) {
        super(userMainLogic);
    }
}