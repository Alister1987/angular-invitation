import * as angular from "angular";
import {IController} from "angular";
import {LocalizationService} from "../../../localization/services/LocalizationService";
import {ConfirmationService} from "../../../shared/input/ConfirmationService";
import {NotificationsService} from "../../../shared/notifications/NotificationsService";
import {Invitation} from "../../models/Invitation";
import {InvitationService} from "../../services/InvitationService";

export class InvitationItemComponentController implements IController {

    public invitation: Invitation;

    public onCancel: () => void;

    public image: any;

    /*@ngInject*/
    constructor(private $scope: angular.IScope,
                private $q: angular.IQService,
                private _invitationService: InvitationService,
                private _confirmationService: ConfirmationService,
                private _notificationsService: NotificationsService,
                private _localizationService: LocalizationService) {
        this.image = [];
        this.image = ["/assets/user.png"];

        this.$scope.$on("$destroy", () => {
            this._confirmationService.destroy();
        });
    }

    public $onInit(): void {
    }

    public showCancellationConfirmationModal(): angular.IPromise<void> {
        return this._confirmationService.displayOk(this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_CANCEL_MODAL_TITLE",
            "Invitation cancellation confirmation"),
            this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_CANCEL_MODAL_DESCRIPTION",
                "Are you sure you want to cancel this invitation?"),
            this._localizationService.translate("SINGLE_YES", "Yes"),
            this._localizationService.translate("SINGLE_NO", "No"))
            .then((result) => {
                if (result.closedWithOk) {
                    this.cancelInvitation();
                }
            });
    }

    public showResendConfirmationModal(): angular.IPromise<void> {
        return this._confirmationService.displayOk(this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_RESEND_MODAL_TITLE",
            "Resend invitation confirmation"),
            this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_RESEND_MODAL_DESCRIPTION",
                "Are you sure you want to resend the invitation?"),
            this._localizationService.translate("SINGLE_YES", "Yes"),
            this._localizationService.translate("SINGLE_NO", "No"))
            .then((result) => {
                if (result.closedWithOk) {
                    this.resendInvitation();
                }
            });
    }

    private cancelInvitation(): angular.IPromise<Invitation> {

        let defer = this.$q.defer<Invitation>();

        this._invitationService.cancelInvitation(this.invitation.invitationId)
            .then(() => {
                defer.resolve();
                this._notificationsService.displaySuccess(this._localizationService.translate(
                    "MODULES_INVITATION_DIRECTIVES_NOTIFICATION_CANCEL_SUCCESS_TITLE", "Invitation cancellation"),
                    this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_NOTIFICATION_CANCEL_SUCCESS_DESCRIPTION",
                        "Invitation successfully cancelled."));
                this.onCancel();
            }).catch(() => {
            defer.reject();
            this._notificationsService.displayError(this._localizationService.translate(
                "MODULES_INVITATION_DIRECTIVES_NOTIFICATION_CANCEL_FAILURE_TITLE", "Invitation Cancellation"),
                this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_NOTIFICATION_CANCEL_FAILURE_DESCRIPTION",
                    "Failed to cancel the invitation."));
        });

        return defer.promise;
    }

    private resendInvitation(): angular.IPromise<Invitation> {

        let defer = this.$q.defer<Invitation>();

        this._invitationService.resendInvitation(this.invitation.invitationId)
            .then((response) => {
                defer.resolve();
                this._notificationsService.displaySuccess(this._localizationService.translate(
                    "MODULES_INVITATION_DIRECTIVES_NOTIFICATION_RESEND_SUCCESS_TILE", "Resend invitation"),
                    this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_NOTIFICATION_RESEND_SUCCESS_DESCRIPTION",
                        "Invitation resent successfully."));
            })
            .catch((error) => {
                defer.reject();
                this._notificationsService.displayError(this._localizationService.translate(
                    "MODULES_INVITATION_DIRECTIVES_NOTIFICATION_RESEND_FAILURE_TITLE", "Resend invitation"),
                    this._localizationService.translate("MODULES_INVITATION_DIRECTIVES_NOTIFICATION_RESEND_FAILURE_DESCRIPTION",
                        "Failed to resend the invitation."));
            });

        return defer.promise;
    }
}
