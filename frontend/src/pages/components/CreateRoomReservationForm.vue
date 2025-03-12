<template>
  <q-dialog v-model="model.open" persistent>
    <q-card class="card-form">
      <q-card-section>
        <div class="text-h6">Agendar uma sala</div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="q-pt-none q-pa-md">
          <q-select
            v-model="model.room"
            :options="optionRooms"
            label="Sala"
            :rules="[rules.required]"
          />
          <q-input v-model="model.description" label="Descrição" :rules="[rules.required]" />
          <q-input
            v-model="model.date"
            label="Data"
            type="date"
            :rules="[rules.required, rules.isDateTodayOrFuture]"
          />
          <custom-input-time
            v-model="model.startTime"
            label="Hora inicio"
            :rules="[rules.required, isToday ? rules.isTimeNowOrFuture : true]"
          />
          <custom-input-time
            v-model="model.endTime"
            label="Hora termino"
            :rules="[rules.required, (value) => rules.isTimeFutureTo(value, model.startTime)]"
          />
        </q-card-section>

        <q-card-actions class="flex q-mt-xs">
          <q-btn class="w-full" label="cancelar" @click="onReset" color="grey" v-close-popup />
          <q-space />
          <q-btn
            class="w-full"
            color="cyan-8"
            label="Salvar"
            type="submit"
            :loading="model.isLoading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-btn
    style="margin-left: auto"
    @click="() => openDialog({ isOpen: true })"
    color="cyan-8"
    rounded
    size="md"
  >
    <span v-if="$q.screen.gt.xs" class="q-mr-xs">Novo Agendamento</span>
    <q-icon name="today" />
  </q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CustomInputTime from 'src/components/CustomInputTime.vue'
import { onMounted, reactive, ref, inject, computed } from 'vue'

const props = defineProps(['modelValue'])
const rules = inject('rules')

const $q = useQuasar()
const optionRooms = ref([])

const isToday = computed(() => {
  if (!model.date) {
    return true
  }
  const now = new Date()
  const date = new Date(`${model.date}T00:00:00`)
  now.setHours(0, 0, 0, 0)

  return now.getTime() == date.getTime()
})

const model = reactive({
  open: false,
  id: null,
  description: '',
  room: null,
  date: null,
  startTime: null,
  endTime: null,
  isLoading: false,
  ...props.model,
})

function openDialog({ isOpen = false }) {
  model.open = isOpen
}

async function onSubmit() {
  model.isLoading = true

  await api
    .post('/v1/reservation/' + (model.id || ''), {
      description: model.description,
      roomId: model.room.value,
      date: model.date,
      startTime: model.startTime,
      endTime: model.endTime,
    })
    .then(() => {
      $q.notify({
        message: 'Agendamento realizado com sucesso',
        color: 'cyan-8',
        position: 'bottom',
        timeout: 1000,
      })
      onReset()
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'warning',
        position: 'bottom',
        timeout: 1000,
      })
    })
    .finally(() => {
      model.isLoading = false
    })
}

function onReset() {
  model.open = false
  model.id = null
  model.description = ''
  model.room = null
  model.date = null
  model.startTime = null
  model.endTime = null
  model.isLoading = false
}

onMounted(async () => {
  const response = await api.get('/v1/rooms')
  const { rooms } = response.data
  optionRooms.value = rooms.map((e) => ({ label: e.name, value: e.id }))
})
</script>
<style scoped>
.card-form {
  width: 100%;
  max-width: 500px;
}
</style>
