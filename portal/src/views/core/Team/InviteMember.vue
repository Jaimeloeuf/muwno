<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useLoader } from "../../../store";
import { TeamRoute } from "../../../router";
import SideDrawer from "../../components/SideDrawer.vue";
import type { CreateOneTeamMemberInvitationDTO } from "@domain-model";

const router = useRouter();
const loaderStore = useLoader();

const email = ref<string>("");

async function invite() {
  if (email.value === "") return alert("Email cannot be empty!");

  loaderStore.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/invite`)
    .bodyJSON<CreateOneTeamMemberInvitationDTO>({ inviteeEmail: email.value })
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) throw err;
  if (!res.ok) throw new Error(`Failed to invite user. ${JSON.stringify(res)}`);

  alert("Invite sent!");

  loaderStore.hide();

  router.push({ name: TeamRoute.name });
}
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Invite new Team Member</span>
    </div>

    <div class="mx-auto w-full max-w-xl">
      <div class="mb-10">
        <label>
          <p class="text-3xl">Email</p>
          <p>They will need to create an account and login with this email!</p>

          <input
            v-model="email"
            type="text"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="janedoe@gmail.com"
          />
        </label>
      </div>

      <div class="mb-10">
        <p class="text-3xl">What's next?</p>
        <ul class="list-decimal px-5 text-lg">
          <li>
            Click <b>Invite</b> to send an email invite to your team member.
          </li>
          <li>
            Once received, they can click the link in the email to sign up for
            an account. If no email is received but invite is successful, they
            can go to
            <a
              target="_blank"
              href="https://portal.thepmftool.com/#/signup"
              class="font-bold underline"
            >
              portal.thepmftool.com/#/signup
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
        class="w-full rounded-lg bg-green-600 p-4 text-xl text-white shadow"
        @click="invite"
      >
        Invite
      </button>
    </div>
  </div>
</template>
