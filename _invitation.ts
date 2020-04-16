import * as angular from "angular";
import {module_common_access} from "../access/_access";
import {module_common_localization} from "../localization/_localization";
import {module_common_shared_action_tracking} from "../shared/action-tracking/_action_tracking";
import {module_common_shared_attributes} from "../shared/attributes/_attributes";
import {module_common_shared_error_handling} from "../shared/error-handling/_error_handling";
import {module_common_shared_input} from "../shared/input/_input";
import {module_common_shared_notifications} from "../shared/notifications/_notifications";
import {module_common_shared_rest} from "../shared/rest/_rest";
import {InvitationItemComponent} from "./components/invitation-item/InvitationItemComponent";
import {InvitationItemComponentController} from "./components/invitation-item/InvitationItemComponentController";
import {InviteSystemAdministratorModalService} from "./modals/invite-system-administrator/InviteSystemAdministratorModalService";
import {InviteUserModalService} from "./modals/invite-user/InviteUserModalService";
import {InvitationRepository} from "./repositories/InvitationRepository";
import {InvitationService} from "./services/InvitationService";

export const module_common_invitation: string = "Routee.Common.Invitation";

angular.module(module_common_invitation, [
    "ui.select",
    "mgcrea.ngStrap.modal",
    module_common_shared_input,
    module_common_shared_notifications,
    module_common_shared_error_handling,
    module_common_shared_action_tracking,
    module_common_shared_attributes,
    module_common_localization,
    module_common_access,
    module_common_shared_rest
])
    .service("_invitationRepository", InvitationRepository)
    .service("_invitationService", InvitationService)
    .controller("InvitationItemComponentController", InvitationItemComponentController)
    .component("invitationItem", new InvitationItemComponent())
    .service("_inviteUserModalService", InviteUserModalService)
    .service("_inviteSystemAdministratorModalService", InviteSystemAdministratorModalService);
