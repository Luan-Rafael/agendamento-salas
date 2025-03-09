<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-form @submit="onSubmit">
        <q-page class="flex flex-center bg-grey-2">
          <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-card-section class="text-center">
              <div class="text-grey-9 text-h5 text-weight-bold">LOGIN</div>
            </q-card-section>
            <q-card-section>
              <q-input dense outlined v-model="email" label="Email Address" :rules="[rules.email]">
              </q-input>
              <q-input
                dense
                outlined
                v-model="password"
                type="password"
                label="Password"
                :rules="[rules.required, rules.minLenght]"
              >
              </q-input>
            </q-card-section>
            <q-card-section>
              <q-btn
                style="border-radius: 8px"
                color="dark"
                rounded
                size="md"
                label="Entrar"
                no-caps
                class="full-width"
                type="submit"
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <router-link
                to="/signup"
                class="text-dark text-weight-bold"
                style="text-decoration: none"
              >
                Cadastrar
              </router-link>
            </q-card-section>
          </q-card>
        </q-page>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth-store'
import { useRouter } from 'vue-router'
import rules from '../utils/rules'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const email = ref('')
const password = ref('')

async function onSubmit() {
  await authStore
    .login(email.value, password.value)
    .then(() => router.push('/home'))
    .catch((err) => {
      $q.notify({
        color: 'warning',
        message: err.message,
        position: 'bottom',
        timeout: 1000,
      })
    })
}
</script>
<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
