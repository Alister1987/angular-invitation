import * as angular from "angular";
import {IScope} from "angular";
import {User} from "../../../access/models/User";
import {UserService} from "../../../access/services/UserService";
import {GoogleTrackingService} from "../../../shared/action-tracking/GoogleTrackingService";
import {InviteUser} from "../../models/InviteUser";
import {InvitationService} from "../../services/InvitationService";
import IModal = mgcrea.ngStrap.modal.IModal;
import IModalService = mgcrea.ngStrap.modal.IModalService;

export class InviteSystemAdministratorModalService {

    public inviteSystemAdminModal: IModal;
    public onInviteCallback: (response) => void;
    public accountId: number;
    private user: User;

    /*@ngInject*/
    constructor(private $q: angular.IQService,
                private $rootScope: angular.IRootScopeService,
                private $modal: IModalService,
                private _googleTrackingService: GoogleTrackingService,
                private _invitationService: InvitationService,
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
        modalScope.inviteSystemAdminServiceController = this;
        modalScope.notCurrentUser = (email: string) => {
            return !(email === this.user.email);
        };

        this.inviteSystemAdminModal = this.$modal({
            scope: modalScope,
            templateUrl: "./modals/invite-system-administrator/invite-system-administrator.tpl.html",
            show: false
        });

        this.inviteSystemAdminModal.$promise
            .then(this.inviteSystemAdminModal.show);
    }

    public inviteSystemAdmin(name, email) {
        this._googleTrackingService.trackInvitation();
        let defer = this.$q.defer<void>();
        if (this.onInviteCallback !== undefined) {
            let invitation: InviteUser = new InviteUser();
            invitation.friendlyName = name;
            invitation.recipientEmail = email;
            invitation.role = "Administrator";
            invitation.targetAccountId = this.accountId;
            this._invitationService
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

        return defer.promise;
    }

    public destroy(): void {
        this.closeModal();
    }

    public closeModal(): void {
        if (this.inviteSystemAdminModal) {
            this.inviteSystemAdminModal.$promise.then(() => {
                this.inviteSystemAdminModal.hide();
                this.inviteSystemAdminModal = undefined;
            });
        }
    }
}
