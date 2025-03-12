<template>
  <div>
    <q-layout view="lHh Lpr lff" container style="min-height: 100dvh">
      <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above :width="200">
        <q-scroll-area
          style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
        >
          <q-list>
            <router-link to="/home" custom @click="() => navigate('/home')">
              <q-item clickable v-ripple :active="$route.path === '/home'" active-class="text-cyan">
                <q-item-section avatar>
                  <q-icon name="today" />
                </q-item-section>

                <q-item-section> Agenda </q-item-section>
              </q-item>
            </router-link>

            <router-link to="/home/rooms" custom @click="() => navigate('/home/rooms')">
              <q-item
                clickable
                v-ripple
                :active="$route.path === '/home/rooms'"
                active-class="text-cyan"
              >
                <q-item-section avatar>
                  <q-icon name="room" />
                </q-item-section>
                <q-item-section> Salas </q-item-section>
              </q-item>
            </router-link>

            <router-link to="/home/users" custom @click="() => navigate('/home/users')">
              <q-item
                clickable
                v-ripple
                :active="$route.path === '/home/users'"
                active-class="text-cyan"
              >
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>

                <q-item-section> Usuários </q-item-section>
              </q-item>
            </router-link>
            <q-separator />

            <q-item
              style="position: absolute; bottom: 0; width: 100%"
              clickable
              v-ripple
              @click="logout"
              color="cyan-8"
            >
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>

              <q-item-section> Logout </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">{{ useAuth.userName }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'

import { formatDateTimeToString } from 'src/utils/text'
import rules from 'src/utils/rules'

provide('formatDateTimeToString', formatDateTimeToString)

provide('rules', rules)

const router = useRouter()
const useAuth = useAuthStore()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout() {
  await useAuth.logout()
  await router.push('/login')
}

async function navigate(path) {
  await router.push(path)
}
</script>
