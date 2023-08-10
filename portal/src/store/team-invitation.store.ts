import { defineStore } from "pinia";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type {
  TeamInvitation,
  ReadManyTeamMemberInvitationDTO,
} from "@domain-model";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Array of pending team invitations.
   */
  invitations: Array<TeamInvitation>;
}

/**
 * Main store for team invitation data
 */
export const useTeamInvitationStore = defineStore("team-invitation", {
  state: (): State => ({ invitations: [] }),

  actions: {
    /**
     * Check for pending team invitations.
     * Returns boolean to indicate if there is any pending team invitations.
     */
    async checkForPendingTeamInvitations() {
      const { res, err } = await sf
        .useDefault()
        .GET(`/team/member/invites`)
        .useHeader(getAuthHeader)
        .runJSON<ReadManyTeamMemberInvitationDTO>();

      // @todo Handle these failures instead of just throwing an error
      if (err) throw err;
      if (!res.ok) throw new Error("Failed to load Team Invitations");

      this.invitations = res.data.invitations;

      return this.invitations.length > 0;
    },

    /**
     * Removes the locally cached invitation so the UI will not be out of sync
     * with the data in the API service.
     */
    removeInvitation(invitationID: number) {
      this.invitations = this.invitations.filter(
        (invitation) => invitation.id !== invitationID
      );
    },
  },
});
