import {User} from "../../access/models/User";
import {Invitation} from "./Invitation";

export class AccountUsersInvitations {

    public name: string;

    public numOfUsers: number;

    public type: "Master" | "Sub";

    public username: string;

    public id: number;

    public users: Array<User>;

    public invitations: Array<Invitation>;

    constructor() {
        this.users = [];
        this.invitations = [];
    }
}
