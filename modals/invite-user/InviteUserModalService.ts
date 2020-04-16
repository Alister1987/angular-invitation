import * as angular from "angular";
import {IPromise, IScope} from "angular";
import * as _ from "lodash";
import {User} from "../../../access/models/User";
import {RoleService} from "../../../access/services/RoleService";
import {UserService} from "../../../access/services/UserService";
import {GoogleTrackingService} from "../../../shared/action-tracking/GoogleTrackingService";
import {InviteUser} from "../../models/InviteUser";
import {InvitationService} from "../../services/InvitationService";
import IModal = mgcrea.ngStrap.modal.IModal;
import IModalService = mgcrea.ngStrap.modal.IModalService;

export class InviteUserModalService {

    public inviteUserModal: IModal;
    public onInviteCallback: (response) => void;
    public accountId: number;
    private user: User;

    /*@ngInject*/
    constructor(private $q: angular.IQService,
                private $rootScope: angular.IRootScopeService,
                private $modal: IModalService,
                private _invitationService: InvitationService,
                private _googleTrackingService: GoogleTrackingService,
                private _roleService: RoleService,
                private _userService: UserService) {
        this.user = new User();
        this._userService.getMe()
            .then((user: User) => this.user = user)
            .catch((error: any) => {
                this.closeModal();
            });
    }

    public invite(onInviteCallback: (response) => void, accountId: number) {
        this.onInviteCallback = onInviteCallback;
        this.accountId = accountId;

        let modalScope: IScope = this.$rootScope.$new();
        this._roleService.getRoles().then((response) => {
            _.remove(response, (role) => role.name === "Administrator");
            modalScope.roles = response;
        });
        modalScope.inviteUserModalServiceController = this;
        modalScope.notCurrentUser = (email: string) => !(email === this.user.email);

        this.inviteUserModal = this.$modal({
            scope: modalScope,
            templateUrl: "./modals/invite-user/invite-user.tpl.html",
            show: false
        });

        this.inviteUserModal.$promise
            .then(this.inviteUserModal.show);
    }

    public inviteUser(name, email, role): IPromise<void> {
        this._googleTrackingService.trackInvitation();
        let defer = this.$q.defer<void>();

        if (this.onInviteCallback) {
            let invitation: InviteUser = new InviteUser();
            invitation.friendlyName = name;
            invitation.recipientEmail = email;
            invitation.role = role.name;
            invitation.targetAccountId = this.accountId;

            return this._invitationService
                .sendInvitation(invitation)
                .then((response) => {
                    defer.resolve();
                    this.closeModal();
                    this.onInviteCallback(response);
                })
                .catch((error) => {
                    this.closeModal();
                    defer.reject(error);
                });
        }

        return this.$q.resolve();
    }

    public destroy(): void {
        this.closeModal();
    }

    public closeModal(): void {
        if (this.inviteUserModal) {
            this.inviteUserModal.$promise
                .then(() => {
                    this.inviteUserModal.hide();
                    this.inviteUserModal = undefined;
                });
        }
    }
}
