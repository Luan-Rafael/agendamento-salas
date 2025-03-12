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
      <q-dialog v-model="dialog.isOpen" persistent >
        <create-room-reservation-form  @refresh="fetchReservations" @closeDialog="closeDialog"  
          :id="dialog.id"
          :description="dialog.description"
          :roomId="dialog.room"
          :date="dialog.date"
          :startTime="dialog.startTime"
          :endTime="dialog.endTime"
          />
      </q-dialog>
    <div
      style="display: flex; flex-direction: column; width: 100%; max-height: calc(100vh - 10rem)"
    >
      <calendar-reservations
        :view="selectedCalendar.value"
        @openReservationForm="openDialog"
        :reservations="reservations"        
      ></calendar-reservations>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import CreateRoomReservationForm from './components/CreateRoomReservationForm.vue'
import CalendarReservations from './components/CalendarReservations.vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import {
  parseTimestamp,
} from '@quasar/quasar-ui-qcalendar'

const $q = useQuasar()

const dialog = reactive({
  isOpen:false,
  id: null,
  description: null,
  date: null,
  roomId: null,
  startTime: null,
  endTime: null,
})

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
 
function closeDialog() {
  dialog.isOpen = null
  dialog.id = null
  dialog.description= null
  dialog.startTime= null
  dialog.endTime= null
  dialog.date = null
  dialog.roomId = null
}
function openDialog({  id=null, description=null, startTime=null, endTime=null, date =null,roomId = null }) {
  dialog.isOpen = true
  dialog.id = id
  dialog.description= description
  dialog.startTime= startTime
  dialog.endTime= endTime
  dialog.date = date 
  dialog.roomId = roomId 
}

const reservations = ref([])

const fetchReservations = async () => {
  const response = await api.get('/v1/reservations').catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'bottom',
      timeout: 1000,
    })
  })
  const { reservations: data } = response.data

  reservations.value = data.map((reservation, index) => {
    const colors = ['#00cbcc', '#00e5e5', '#00ffff', '#2196f3', '#6bbef9']
    const startDate = new Date(reservation.startTime)
    const endDate = new Date(reservation.endTime)
    const durationInMinutes = Math.floor((endDate - startDate) / 60000)
    return {
      id: reservation.id,
      title: `${reservation.description} - ${reservation.room}`,
      description: reservation.description,
      details: reservation.room,
      date: parseTimestamp(reservation.startTime).date,
      time: `${parseTimestamp(reservation.startTime).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.startTime).minute.toString().padStart(2, '0')}`,
      startTime: `${parseTimestamp(reservation.startTime).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.startTime).minute.toString().padStart(2, '0')}`,
      endTime: `${parseTimestamp(reservation.endTime).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.endTime).minute.toString().padStart(2, '0')}`,
      duration: durationInMinutes,
      bgcolor: colors[index % colors.length],
      edit: reservation.edit,
    }
  })
}

onMounted(async () => {
  await fetchReservations()
})
</script>
