<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-form @submit="onSubmit" @reset="onReset">
        <q-page class="flex flex-center bg-grey-2">
          <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-card-section class="text-center">
              <div class="text-cyan-8 text-h5 text-weight-bold">SIGN UP</div>
            </q-card-section>
            <q-card-section>
              <q-input
                dense
                outlined
                v-model="name"
                label="Nome"
                :rules="[rules.userName]"
                color="cyan-8"
              >
              </q-input>
              <q-input dense outlined v-model="email" label="E-mail" :rules="[rules.email]">
              </q-input>
              <q-input
                dense
                outlined
                v-model="password"
                type="password"
                label="Senha"
                :rules="[rules.required, rules.minLenght]"
                color="cyan-8"
              >
              </q-input>
            </q-card-section>
            <q-card-section>
              <q-btn
                style="border-radius: 8px"
                color="cyan-8"
                rounded
                size="md"
                label="Cadastrar"
                no-caps
                class="full-width"
                type="submit"
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <router-link
                to="/login"
                class="text-cyan-8 text-weight-bold"
                style="text-decoration: none"
              >
                Entrar
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
import rules from '../utils/rules'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

async function onSubmit() {
  const authStore = useAuthStore()

  await authStore
    .signup(name.value, email.value, password.value)
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

async function onReset() {
  name.value = ''
  email.value = ''
  password.value = ''
}
</script>
<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
