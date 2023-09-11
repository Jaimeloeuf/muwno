<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useUserStore } from "../../../store";
import { InviteMemberRoute } from "../../../router";
import SideDrawer from "../../components/SideDrawer.vue";
import { getDateString } from "../../../utils/date-formatting/getDateString";
import { type ReadManyUserDTO, Role, roleMapper } from "@domain-model";

const orgStore = useOrg();
const userStore = useUserStore();

const orgDetails = await orgStore.getOrg();

const { res, err } = await sf
  .useDefault()
  .GET(`/team/member/all`)
  .useHeader(getAuthHeader)
  .runJSON<ReadManyUserDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load Team Members");

const teamMembers = res.data.users;
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">{{ orgDetails.name }}</span>
    </div>

    <!-- @todo -->
    <!-- OrgOwner/OrgAdmin can see all active invites that have not been accepted -->
    <!-- OrgOwner/OrgAdmin should be able to remove a team member -->

    <div class="mx-auto max-w-4xl">
      <div class="mx-6 flex flex-col items-center justify-between md:flex-row">
        <p class="mr-2 text-3xl md:mr-12">
          Team Members ({{ teamMembers.length }})
        </p>

        <div
          v-if="
            userStore.user.role === Role.OrgOwner ||
            userStore.user.role === Role.OrgAdmin
          "
          class="w-full flex-grow md:w-max"
        >
          <router-link
            :to="{ name: InviteMemberRoute.name }"
            class="my-6 inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-8"
            :class="{
              'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-600':
                teamMembers.length > 1,
              'bg-green-600 text-white': teamMembers.length === 1,
            }"
          >
            <div class="text-2xl">Invite Team Member</div>
            <svg
              class="h-8 w-8"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </router-link>
        </div>
      </div>

      <div class="mx-6 flex flex-col">
        <div
          v-for="(teamMember, index) in teamMembers"
          :key="teamMember.id"
          class="my-3 rounded-lg bg-slate-50 p-6 text-gray-900 shadow"
        >
          <div class="flex flex-row items-center">
            <p class="pr-3 text-2xl">
              {{ index + 1 }}
            </p>

            <div class="flex-grow border-l border-slate-300 pl-3">
              <p class="mb-2 text-xl">{{ teamMember.name }}</p>
              <p v-if="teamMember.role !== undefined" class="mb-2">
                {{ roleMapper[teamMember.role] }}
              </p>
              <hr class="my-2" />
              <p class="mb-2">{{ teamMember.email }}</p>
              <p class="mb-2">
                Joined on {{ getDateString(teamMember.createdAt) }}
              </p>
              <p class="mb-2">{{ teamMember.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
