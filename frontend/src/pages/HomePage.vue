<template>
  <div class="flex">
    <q-select
      v-model="selectedCalendar"
      label="Tipo visão"
      outlined
      dense
      options-dense
      item-value
      :options="optionsCalendar"
      style="min-width: 180px"
    />
    <create-room-reservation-form :modelValue="dialogReservationForm" />
    <div
      style="display: flex; flex-direction: column; width: 100%; max-height: calc(100vh - 10rem)"
    >
      <calendar-reservations
        :view="selectedCalendar.value"
        @openReservationForm="openReservationForm"
      ></calendar-reservations>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CreateRoomReservationForm from './components/CreateRoomReservationForm.vue'
import CalendarReservations from './components/CalendarReservations.vue'

const optionsCalendar = [
  {
    label: 'Diário',
    value: 'day',
  },
  {
    label: 'Semanal',
    value: 'week',
  },
  {
    label: 'Mensal',
    value: 'month',
  },
]
const selectedCalendar = ref(optionsCalendar[0])

const dialogReservationForm = ref({})

function openReservationForm({ id, description, startTime, endTime, date }) {
  dialogReservationForm.value = {
    open: true,
    id,
    description,
    startTime,
    endTime,
    date,
  }
}
</script>
