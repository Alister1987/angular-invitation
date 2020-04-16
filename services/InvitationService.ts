import * as angular from "angular";
import {LocalizationService} from "../../localization/services/LocalizationService";
import {ErrorMessageResolver} from "../../shared/error-handling/ErrorMessageResolver";
import {NotificationsService} from "../../shared/notifications/NotificationsService";
import {Invitation} from "../models/Invitation";
import {InviteUser} from "../models/InviteUser";
import {InvitationRepository} from "../repositories/InvitationRepository";

export class InvitationService {

    /*@ngInject*/
    constructor(private $q: angular.IQService,
                private _notificationsService: NotificationsService,
                private _errorMessageResolver: ErrorMessageResolver,
                private _localizationService: LocalizationService,
                private _invitationRepository: InvitationRepository) {
    }

    public emailExists(email: string, invitationId: string): angular.IPromise<boolean> {
        let defer = this.$q.defer<boolean>();
        this._invitationRepository.emailExists(email, invitationId)
            .then((response) => defer.resolve(true))
            .catch((error) => {
                if (error.status === 404) {
                    defer.resolve(false);
                } else {
                    defer.reject(error);
                }
            });

        return defer.promise;
    }

    public getInvitation(invitationId: string): angular.IPromise<Invitation> {
        return this._invitationRepository.findById(invitationId)
    }

    public cancelInvitation(invitationId: string): angular.IPromise<Invitation> {
        return this._invitationRepository.cancelInvitation(invitationId);
    }

    public sendInvitation(invitation: InviteUser): angular.IPromise<Invitation> {
        let defer = this.$q.defer<Invitation>();

        this._invitationRepository.send(invitation)
            .then((invitation: Invitation) => {
                defer.resolve(invitation);
            })
            .catch((error) => {
                this._notificationsService.displayError(
                    this._localizationService.translate("SINGLE_ERROR", "Error"),
                    this._errorMessageResolver.resolve(error)
                );
                defer.reject(error);
            });

        return defer.promise;
    }

    public resendInvitation(id: string): angular.IPromise<Invitation> {
        return this._invitationRepository.resend(id);
    }
}
