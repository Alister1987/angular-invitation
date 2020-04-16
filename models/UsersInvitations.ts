import {User} from "../../access/models/User";
import {Invitation} from "./Invitation";
export class UsersInvitations {

    public users: Array<User>;
    public invitations: Array<Invitation>;

    constructor() {
        this.users = [];
        this.invitations = [];
    }
}
