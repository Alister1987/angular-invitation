import * as angular from "angular";
import {LocalizationService} from "../../../localization/services/LocalizationService";
import {ConfirmationService} from "../../../shared/input/ConfirmationService";
import {NotificationsService} from "../../../shared/notifications/NotificationsService";
import {module_common_invitation} from "../../_invitation";
import {Invitation} from "../../models/Invitation";
import {InvitationStatus} from "../../models/InvitationStatus";
import {InvitationService} from "../../services/InvitationService";
import {InvitationItemComponentController} from "./InvitationItemComponentController";

describe("InvitationItemComponentController tests", () => {

    let promiseService: angular.IQService;
    let rootScope: angular.IRootScopeService;
    let invitationServiceMock: InvitationService;
    let localizationService: LocalizationService;
    let notificationServiceMock: NotificationsService;
    let confirmationServiceMock: ConfirmationService;
    let controller: any;

    let invitationItemComponentController: InvitationItemComponentController;

    beforeEach(() => {
        angular.module("spec", [module_common_invitation]);
        angular.mock.module("spec");

        inject((
            $q: angular.IQService,
            $rootScope: angular.IRootScopeService,
            $controller,
            _invitationService: InvitationService,
            _localizationService: LocalizationService,
            _notificationsService: NotificationsService,
            _confirmationService: ConfirmationService
        ) => {
            promiseService = $q;
            rootScope = $rootScope;
            invitationServiceMock = _invitationService;
            localizationService = _localizationService;
            notificationServiceMock = _notificationsService;
            confirmationServiceMock = _confirmationService;
            controller = $controller;
        });

    });

    it("cancel confirmation modal is shown and if the user selects yes, the invitation is canceled", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: true}));

        spyOn(notificationServiceMock, "displaySuccess").and.callFake(() => {});

        spyOn(invitationServiceMock, "cancelInvitation").and.callFake(() => {
            let defer  = promiseService.defer<void>();

            defer.resolve();

            return defer.promise;
        });

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        let isCalled = false;
        invitationItemComponentController.onCancel = () => {
            isCalled = true;
        };

        invitationItemComponentController.showCancellationConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.cancelInvitation).toHaveBeenCalled();
        expect(notificationServiceMock.displaySuccess).toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
        expect(isCalled).toBeTruthy();
    });

    it("cancel confirmation modal is shown and if the user selects yes, the invitation cancellation fails and an " +
        "error notification is shown", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: true}));

        spyOn(notificationServiceMock, "displayError").and.callFake(() => {});

        spyOn(invitationServiceMock, "cancelInvitation").and.callFake(() => {
            let defer  = promiseService.defer<void>();

            defer.reject();

            return defer.promise;
        });

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        let isCalled = false;
        invitationItemComponentController.onCancel = () => {
            isCalled = true;
        };

        invitationItemComponentController.showCancellationConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.cancelInvitation).toHaveBeenCalled();
        expect(notificationServiceMock.displayError).toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
        expect(isCalled).toBeFalsy();
    });

    it("the cancel confirmation modal is shown and if the user selects no, the invitation is not canceled", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: false}));

        spyOn(invitationServiceMock, "cancelInvitation").and.callFake(() => {});

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        let isCalled = false;
        invitationItemComponentController.onCancel = () => {
            isCalled = true;
        };

        invitationItemComponentController.showCancellationConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.cancelInvitation).not.toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
        expect(isCalled).toBeFalsy();
    });

    it("controller - shows resend confirmation modal and if the user selects yes, the invitation is resent", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: true}));

        spyOn(notificationServiceMock, "displaySuccess").and.callFake(() => {});

        spyOn(invitationServiceMock, "resendInvitation").and.callFake(() => {
            let defer  = promiseService.defer<void>();

            defer.resolve();

            return defer.promise;
        });

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        invitationItemComponentController.showResendConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.resendInvitation).toHaveBeenCalled();
        expect(notificationServiceMock.displaySuccess).toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
    });

    it("controller - resends confirmation modal is shown and if the user selects yes, the invitation resent fails " +
        "and a notification is shown", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: true}));

        spyOn(notificationServiceMock, "displayError").and.callFake(() => {});

        spyOn(invitationServiceMock, "resendInvitation").and.callFake(() => {
            let defer  = promiseService.defer<void>();

            defer.reject();

            return defer.promise;
        });

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        invitationItemComponentController.showResendConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.resendInvitation).toHaveBeenCalled();
        expect(notificationServiceMock.displayError).toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
    });

    it("controller - the cancel confirmation modal is shown and if the user selects no, the invitation is not resent", () => {

        spyOn(confirmationServiceMock, "displayOk").and.returnValue(promiseService.resolve({closedWithOk: false}));

        spyOn(invitationServiceMock, "resendInvitation").and.callFake(() => {});

        spyOn(localizationService, "translate").and.returnValue("foo");

        invitationItemComponentController = controller("InvitationItemComponentController", {$scope: rootScope});

        invitationItemComponentController.invitation = new Invitation();
        invitationItemComponentController.invitation.status = InvitationStatus.Pending;
        invitationItemComponentController.invitation.accountId = 1;
        invitationItemComponentController.invitation.recipientEmail = "foo@bla.lol";
        invitationItemComponentController.invitation.friendlyName = "roflcopter";
        invitationItemComponentController.invitation.invitationId = "theid";

        invitationItemComponentController.showResendConfirmationModal();

        rootScope.$digest();

        expect(invitationServiceMock.resendInvitation).not.toHaveBeenCalled();
        expect(confirmationServiceMock.displayOk).toHaveBeenCalledWith("foo", "foo", "foo", "foo");
    });
});
