<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useLoader, useNotif } from "../../../store";
import { SignupRoute, TeamRoute } from "../../../router";
import TopNavbar from "../../shared/TopNavbar.vue";
import { getAbsoluteUrlFromRoute } from "../../../utils/getAbsoluteUrlFromRoute";
import {
  Role,
  roleMapper,
  type CreateOneTeamMemberInvitationDTO,
} from "@domain-model";

const router = useRouter();
const loader = useLoader();
const notif = useNotif();

const portalLink = getAbsoluteUrlFromRoute({ name: SignupRoute.name });
const email = ref<string>("");
const selectedRole = ref<Role>(Role.OrgUser);

async function invite() {
  if (email.value === "") return alert("Email cannot be empty!");

  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/invite`)
    .bodyJSON<CreateOneTeamMemberInvitationDTO>({
      inviteeEmail: email.value,
      role: selectedRole.value,
    })
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) throw err;
  if (!res.ok) throw new Error(`Failed to invite user. ${JSON.stringify(res)}`);

  loader.hide();

  notif.setSnackbar("Invite sent!");

  router.push({ name: TeamRoute.name });
}
</script>

<template>
  <div>
    <TopNavbar back>Invite Team</TopNavbar>

    <div class="mx-auto w-full max-w-xl">
      <div class="pb-10">
        <label>
          <p class="text-2xl">Email</p>
          <p>They will need to create an account and login with this email!</p>

          <input
            v-model.trim="email"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            placeholder="janedoe@gmail.com"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-2xl">Role</p>
          <ul class="list-decimal px-5">
            <li>
              'User' can view and manage Product details like score and tasks
              without any destructive rights like renaming or deleting a
              Product.
            </li>
            <li>
              'Organisation Admin' can do almost everything except for
              destructive actions like deleting the entire Organisation.
            </li>
            <li>'Organisation Owner' can do everything.</li>
          </ul>

          <select
            v-model="selectedRole"
            class="mt-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4"
          >
            <option
              v-for="role in Role"
              :key="role"
              :value="role"
              :selected="role === selectedRole"
            >
              {{ roleMapper[role] }}
            </option>
          </select>
        </label>
      </div>

      <div class="pb-10">
        <p class="text-2xl">What's next?</p>
        <ul class="list-decimal px-5">
          <li>
            Click <b>Invite</b> to send an email invite to your team member.
          </li>
          <li>
            Once received, they can click the link in the email to sign up for
            an account. If no email is received but invite is successful, they
            can go to
            <a
              target="_blank"
              :href="`${portalLink}`"
              class="font-bold underline"
            >
              {{ `${portalLink}` }}
            </a>
            to sign up directly.
          </li>
          <li>
            Once they have successfully signed up for an account, they will be
            asked to accept the invitation to join your Team.
          </li>
          <li>Click join and they can start using the tool!</li>
        </ul>
      </div>

      <button
        class="w-full rounded-lg border border-green-600 p-4 text-xl text-green-600"
        @click="invite"
      >
        Invite
      </button>
    </div>
  </div>
</template>
