import {AbstractComponentOptions} from "../../../shared/components/AbstractComponentOptions";
import {InvitationItemComponentController} from "./InvitationItemComponentController";

export class InvitationItemComponent extends AbstractComponentOptions {

    constructor() {
            super("./components/invitation-item/invitation-item.tpl.html", InvitationItemComponentController);
            this.bindings = {invitation: "<", onCancel: "&"};
    }
}
