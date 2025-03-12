<template>
  <div class="flex">
    <q-select
      v-model="selectedCalendar"
      label="Tipo visão"
      outlined
      dense
      options-dense
      :options="['Diário', 'Mensal']"
      style="min-width: 180px"
    />

    <create-room-reservation-form @refresh="fetchReservations" />
    <div style="display: flex; width: 100%; max-height: calc(100vh - 9rem)">
      <q-calendar ref="calendar"></q-calendar>
    </div>
  </div>
</template>

<script setup>
import CreateRoomReservationForm from './components/CreateRoomReservationForm.vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
const $q = useQuasar()
const rows = ref([])

const selectedCalendar = ref('Diário')
const calendar = ref()

const fetchReservations = async () => {
  const response = await api.get('/v1/reservations').catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'bottom',
      timeout: 1000,
    })
  })
  const { reservations } = response.data
  rows.value = reservations
}

fetchReservations()
</script>
