<template>
  {{ optionRooms }} <br>
  {{ model }}
  <q-dialog v-model="model.open">
    <q-card>
      <q-card-section>
        <div class="text-h6">Agendar uma sala</div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="q-pt-none q-pa-md" style="max-width: 300px">
          <q-select v-model="model.room" :options="optionRooms" label="Sala" />
          <q-input v-model="model.date" label="Data" type="date" :rules="[rules.required, rules.isDateTodayOrFuture]" />
          <custom-input-time v-model="model.startTime" label="Hora inicio" :rules="[rules.required, rules.isTimeNowOrFuture]" />
          <custom-input-time v-model="model.endTime" label="Hora termino" />
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
    Novo Agendamento
    <q-icon class="q-ml-xs" name="today" />
  </q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CustomInputTime from 'src/components/CustomInputTime.vue'
import { onMounted, reactive, ref, inject } from 'vue'

const rules = inject('rules')

const emit = defineEmits('refresh')
const $q = useQuasar()
const optionRooms = ref([])

const model = reactive({
  open: false,
  id: null,
  description: '',
  room: null,
  date: new Date(),
  startTime: null,
  endTime: null,
  isLoading: false
})

function openDialog({ isOpen = false, id = null, name = '' }) {
  model.open = isOpen
  model.id = id
  model.name = name
}

async function onSubmit() {
  model.isLoading = true
  await api.post('/v1/reservations', { name: model.name })
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

onMounted(async () => {
  const response = await api.get('/v1/rooms')
  console.log(response)
  const { rooms } = response.data
  optionRooms.value = rooms.map(e => ({ label: e.name, value: e.id }))
})


</script>
