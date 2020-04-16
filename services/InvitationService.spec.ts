import * as angular from "angular";
import {LocalizationService} from "../../localization/services/LocalizationService";
import {NotificationsService} from "../../shared/notifications/NotificationsService";
import {module_common_invitation} from "../_invitation";
import {Invitation} from "../models/Invitation";
import {InvitationStatus} from "../models/InvitationStatus";
import {InviteUser} from "../models/InviteUser";
import {InvitationRepository} from "../repositories/InvitationRepository";
import {InvitationService} from "./InvitationService";

describe("InvitationService tests", () => {

    let promiseMock: angular.IQService;
    let rootScope: angular.IRootScopeService;
    let invitationRepository: InvitationRepository;
    let invitationService: InvitationService;
    let notificationsService: NotificationsService;
    let localizationService: LocalizationService;

    beforeEach(() => {

        angular.module("spec", [module_common_invitation]);
        angular.mock.module("spec");

        inject((
            $q: angular.IQService,
            $rootScope: angular.IRootScopeService,
            _notificationsService: NotificationsService,
            _localizationService: LocalizationService,
            _invitationRepository: InvitationRepository,
            _invitationService: InvitationService) => {
            promiseMock = $q;
            rootScope = $rootScope;
            invitationRepository = _invitationRepository;
            invitationService = _invitationService;
            notificationsService = _notificationsService;
            localizationService = _localizationService;
        });
    });

    it("emailExists - returns true if the email exists", () => {
        spyOn(invitationRepository, "emailExists").and.callFake((email, invId) => {
            let defer = promiseMock.defer();

            if ("foo" === email) {
                defer.resolve({status: 200});
            } else {
                defer.resolve({status: 404});
            }

            return defer.promise;
        });

        let res = null;

        invitationService.emailExists("foo", "12345").then((response) => {
            res = response;
        })
            .catch((error) => {
                res = error;
            });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toBeTruthy();
        expect(invitationRepository.emailExists).toHaveBeenCalledWith("foo", "12345");
    });

    it("emailExists - returns false if the email does not exist", () => {
        spyOn(invitationRepository, "emailExists").and.callFake((email, invId) => {
            let defer = promiseMock.defer();

            if (email === "foo") {
                defer.resolve({status: 200});
            } else {
                defer.reject({status: 404});
            }

            return defer.promise;
        });

        let res = null;

        invitationService.emailExists("fo", "12345").then((response) => {
            res = response;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toBeFalsy();
        expect(invitationRepository.emailExists).toHaveBeenCalledWith("fo", "12345");
    });

    it("getInvitation - gets an Invitation if found", () => {
        spyOn(invitationRepository, "findById").and.callFake((id) => {
            let defer = promiseMock.defer();

            let invitation = new Invitation();
            invitation.status = InvitationStatus.Pending;
            invitation.accountId = 1;
            invitation.recipientEmail = "foo@bla.lol";
            invitation.friendlyName = "roflcopter";
            invitation.invitationId = id;
            invitation.role = "myRole";

            defer.resolve(invitation);

            return defer.promise;
        });

        let res: Invitation;

        invitationService.getInvitation("12345").then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res.invitationId).toBe("12345");
        expect(res.friendlyName).toBe("roflcopter");
        expect(res.recipientEmail).toBe("foo@bla.lol");
        expect(res.status).toBe(InvitationStatus.Pending);
        expect(res.role).toBe("myRole");
        expect(invitationRepository.findById).toHaveBeenCalledWith("12345");
    });

    it("getInvitation - does not get an Invitation if not found", () => {
        spyOn(invitationRepository, "findById").and.returnValue(promiseMock.reject("404 Not Found!"));

        let res = null;

        invitationService.getInvitation("12345").then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toBe("404 Not Found!");
        expect(invitationRepository.findById).toHaveBeenCalledWith("12345");
    });

    it("cancelInvitation - cancels an invitation when found", () => {
        spyOn(invitationRepository, "cancelInvitation").and.callFake((id) => {
            let defer = promiseMock.defer();

            let invitation = new Invitation();
            invitation.status = InvitationStatus.Cancelled;
            invitation.accountId = 1;
            invitation.recipientEmail = "foo@bla.lol";
            invitation.friendlyName = "roflcopter";
            invitation.invitationId = id;
            invitation.role = "myRole";

            defer.resolve(invitation);

            return defer.promise;
        });

        let res: Invitation;

        invitationService.cancelInvitation("12345").then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res.invitationId).toBe("12345");
        expect(res.friendlyName).toBe("roflcopter");
        expect(res.recipientEmail).toBe("foo@bla.lol");
        expect(res.status).toBe(InvitationStatus.Cancelled);
        expect(res.role).toBe("myRole");
        expect(invitationRepository.cancelInvitation).toHaveBeenCalledWith("12345");
    });

    it("cancelInvitation - does not cancel an invitation when it is not found or it is already cancelled", () => {
        spyOn(invitationRepository, "cancelInvitation").and.returnValue(promiseMock.reject("error!"));
        let res: string;

        invitationService.cancelInvitation("12345").catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).toBe("error!");
        expect(invitationRepository.cancelInvitation).toHaveBeenCalledWith("12345");
    });

    it("sendInvitation - sends an invitation", () => {

        let invitation: InviteUser = new InviteUser();
        invitation.friendlyName = "frName";
        invitation.recipientEmail = "test@email.com";
        invitation.role = "Admin";
        invitation.targetAccountId = 123;

        spyOn(invitationRepository, "send").and.callFake((invitation) => {
            let defer = promiseMock.defer();

            invitation.invitationId = "1";
            defer.resolve(invitation);

            return defer.promise;
        });

        let res: Invitation;

        invitationService.sendInvitation(invitation).then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res.invitationId).toBe("1");
        expect(res.friendlyName).toBe("frName");
        expect(res.recipientEmail).toBe("test@email.com");
        expect(res.role).toBe("Admin");
        expect(invitationRepository.send).toHaveBeenCalledWith(invitation);
    });

    it("sendInvitation - does not send an invitation when error is returned from repo", () => {

        let invitation: InviteUser = new InviteUser();
        invitation.friendlyName = "frName";
        invitation.recipientEmail = "test@email.com";
        invitation.role = "Admin";
        invitation.targetAccountId = 123;

        spyOn(invitationRepository, "send").and.returnValue(promiseMock.reject("error!"));
        spyOn(notificationsService, "displayError").and.callFake(() => {
        });
        spyOn(localizationService, "translate").and.returnValue("");

        let res;

        invitationService.sendInvitation(invitation).then((response) => res = response).catch((error) => res = error);

        rootScope.$digest();

        expect(res).toBe("error!");
        expect(invitationRepository.send).toHaveBeenCalledWith(invitation);
        expect(notificationsService.displayError).toHaveBeenCalled();
    });

    it("resendInvitation - resends an invitation", () => {
        spyOn(invitationRepository, "resend").and.callFake((invId) => {
            let defer = promiseMock.defer();

            defer.resolve(invId);

            return defer.promise;
        });

        let res = null;

        invitationService.resendInvitation("1234").then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toBe("1234");
        expect(invitationRepository.resend).toHaveBeenCalledWith("1234");
    });

    it("resendIvitation - does not resend an invitation if the repository sends an error", () => {
        spyOn(invitationRepository, "resend").and.returnValue(promiseMock.reject("error"));

        let res = null;

        invitationService.resendInvitation("1234").then((response) => {
            res = response;
        }).catch((error) => {
            res = error;
        });

        rootScope.$digest();

        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        expect(res).toBe("error");
        expect(invitationRepository.resend).toHaveBeenCalledWith("1234");
    });
});
