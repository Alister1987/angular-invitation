export class InvitationStatus {
    /**
     * The invitation has been sent to the potential user.
     */
    public static Pending: string = "Pending";

    /**
     * The invitation has been canceled by the sender.
     */
    public static Cancelled: string = "Cancelled";

    /**
     * The invitation has been accepted by the receiver,
     * and he became a valid user of the system.
     */
    public static Accepted: string = "Accepted";
}
