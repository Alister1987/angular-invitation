import * as angular from "angular";
import {MenshenClientAuthenticatedResource} from "../../shared/rest/MenshenClientAuthenticatedResource";
import {MenshenUserAuthenticatedResource} from "../../shared/rest/MenshenUserAuthenticatedResource";
import {Invitation} from "../models/Invitation";
import {InviteUser} from "../models/InviteUser";

export class InvitationRepository {

    /*@ngInject*/
    constructor(private _menshenUserAuthenticatedResource: MenshenUserAuthenticatedResource,
                private _menshenClientAuthenticatedResource: MenshenClientAuthenticatedResource) {
    }

    public emailExists(email: string, invitationId: string): angular.IPromise<boolean> {
        return this._menshenClientAuthenticatedResource.getResource()
            .one("bff/web/invitations/" + invitationId + "/email")
            .head({value: email}, {});
    }

    public findById(invitationId: string): angular.IPromise<Invitation> {
        return this._menshenClientAuthenticatedResource.getResource().one("bff/web/invitations", invitationId).get();
    }

    public send(invitation: InviteUser): angular.IPromise<Invitation> {
        return this._menshenUserAuthenticatedResource.getResource().one("bff/web/invitations").customPOST(invitation);
    }

    public resend(invitationId: string): angular.IPromise<Invitation> {
        return this._menshenUserAuthenticatedResource.getResource().one("bff/web/invitations", invitationId).one("resend").customPOST();
    }

    public cancelInvitation(invitationId: string): angular.IPromise<Invitation> {
        return this._menshenUserAuthenticatedResource.getResource().one("bff/web/invitations", invitationId).one("cancel").customPOST();
    }
}
