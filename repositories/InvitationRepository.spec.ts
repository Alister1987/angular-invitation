import * as angular from "angular";
import * as Restangular from "restangular";
import {MenshenClientAuthenticatedResource} from "../../shared/rest/MenshenClientAuthenticatedResource";
import {MenshenUserAuthenticatedResource} from "../../shared/rest/MenshenUserAuthenticatedResource";
import {module_common_invitation} from "../_invitation";
import {Invitation} from "../models/Invitation";
import {InviteUser} from "../models/InviteUser";
import {InvitationRepository} from "./InvitationRepository";

describe("InvitationRepository tests", () => {

    let restangularService: Restangular.IService;
    let invitationRepository: InvitationRepository;
    let serverMock: angular.IHttpBackendService;
    let rootScope: angular.IRootScopeService;
    let menshenClientAuthenticatedResource: MenshenClientAuthenticatedResource;
    let menshenUserAuthenticatedResource: MenshenUserAuthenticatedResource;

    beforeEach(() => {
        angular.module("spec", [module_common_invitation]);
        angular.mock.module("spec");

        inject((
            $httpBackend: angular.IHttpBackendService,
            $rootScope: angular.IRootScopeService,
            Restangular: Restangular.IService,
            _menshenClientAuthenticatedResource: MenshenClientAuthenticatedResource,
            _menshenUserAuthenticatedResource: MenshenUserAuthenticatedResource,
            _invitationRepository: InvitationRepository
        ) => {
            serverMock = $httpBackend;
            rootScope = $rootScope;
            menshenClientAuthenticatedResource = _menshenClientAuthenticatedResource;
            menshenUserAuthenticatedResource = _menshenUserAuthenticatedResource;
            restangularService = Restangular;
            invitationRepository = _invitationRepository;
        });
    });

    afterEach(() => {
        serverMock.verifyNoOutstandingExpectation();
        serverMock.verifyNoOutstandingRequest();
    });

    it("emailExists - rest call is correct, authorization is correct", () => {

        spyOn(menshenClientAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectHEAD("/bff/web/invitations/2345/email?value=meh").respond("some response");

        let receivedResponse = null;

        invitationRepository.emailExists("meh", "2345").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = "error";
        });
        serverMock.flush();
        rootScope.$digest();

        expect(menshenClientAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse).not.toBeNull();
        expect(receivedResponse).not.toBe("error");
        expect(receivedResponse).toBe("some response");
    });

    it("emailExists - rest call is correct, correct authorization, email not found.", () => {

        spyOn(menshenClientAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectHEAD("/bff/web/invitations/2345/email?value=meh").respond(404);

        let receivedResponse: any;

        invitationRepository.emailExists("meh", "2345").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenClientAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse).not.toBeNull();
        expect(receivedResponse.status).toBe(404);
    });

    it("findById - rest call is correct.", () => {

        spyOn(menshenClientAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectGET("/bff/web/invitations/1234").respond("Here you go!");

        let receivedResponse = null;

        invitationRepository.findById("1234").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenClientAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse).not.toBeNull();
        expect(receivedResponse).toBe("Here you go!");
    });

    it("findById - rest call is correct, invitation not found.", () => {
        spyOn(menshenClientAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectGET("/bff/web/invitations/b123h").respond(404);

        let receivedResponse: any;

        invitationRepository.findById("b123h").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenClientAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse.status).toBe(404);
    });

    it("cancelInvitation - rest call is correct.", () => {
        spyOn(menshenUserAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectPOST("/bff/web/invitations/1234/cancel").respond("yay");

        let receivedResponse = null;

        invitationRepository.cancelInvitation("1234").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenUserAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse).not.toBeNull();
        expect(receivedResponse).not.toBeUndefined();
        expect(receivedResponse).toBe("yay");
    });

    it("send - rest call is correct.", () => {
        spyOn(menshenUserAuthenticatedResource, "getResource").and.returnValue(restangularService);

        let invitation = {targetAccountId: 12} as InviteUser;
        let receivedInvitation = {accountId: 12, invitationId: "123"} as Invitation;

        serverMock.expectPOST("/bff/web/invitations").respond(receivedInvitation);

        let receivedResponse: Invitation = null;

        invitationRepository.send(invitation).then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenUserAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse).not.toBeNull();
        expect(receivedResponse.accountId).toBe(12);
        expect(receivedResponse.invitationId).toBe("123");
    });

    it("resend - rest call is correct.", () => {
        spyOn(menshenUserAuthenticatedResource, "getResource").and.returnValue(restangularService);

        serverMock.expectPOST("/bff/web/invitations/1234/resend").respond({value: "an invitation"});

        let receivedResponse: any;

        invitationRepository.resend("1234").then((response) => {
            receivedResponse = response;
        }).catch((error) => {
            receivedResponse = error;
        });

        serverMock.flush();
        rootScope.$digest();

        expect(menshenUserAuthenticatedResource.getResource).toHaveBeenCalled();
        expect(receivedResponse.value).toBe("an invitation");
    });

});
