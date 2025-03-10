<template>
  <q-dialog v-model="model.open">
    <q-card>
      <q-card-section>
        <div class="text-h6">Cadastrar uma nova sala</div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="q-pt-none">
          <q-input v-model="model.id" label="ID" readonly v-if="model.id" />
          <q-input v-model="model.name" label="Sala" :rules="[rules.required, rules.minLenght]" />
        </q-card-section>

        <q-card-actions class="flex q-mt-xs">
          <q-btn class="w-full" label="cancelar" @click="onReset" color="grey" v-close-popup />
          <q-space />
          <q-btn class="w-full" color="cyan-8" label="Salvar" type="submit" :loading="model.isLoading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-btn style="margin-left: auto;" @click="() => openDialog({ isOpen: true })" color="cyan-8" rounded size="md">
    Nova Sala
    <q-icon name="add" />
  </q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import rules from 'src/utils/rules'
import { reactive } from 'vue'

const emit = defineEmits('refresh')
const $q = useQuasar()

const model = reactive({
  open: false,
  id: null,
  name: '',
  isLoading: false
})

function openDialog({ isOpen = false, id = null, name = '' }) {
  model.open = isOpen
  model.id = id
  model.name = name
}

async function onSubmit() {
  model.isLoading = true
  await api.post('/v1/rooms', { name: model.name })
    .then(() => {
      $q.notify({
        message: 'Registro salvo com sucesso',
        color: 'cyan-8',
        position: 'bottom',
        timeout: 1000,
      })
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'negative',
        position: 'bottom',
        timeout: 1000,
      })
    }).finally(() => {
      emit('refresh')
      onReset()

    })
}

function onReset() {
  model.open = false
  model.id = null
  model.name = ''
  model.isLoading = false
}

</script>
