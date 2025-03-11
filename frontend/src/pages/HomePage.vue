<template>
    <div class="flex column">
        <create-room-reservation-form @refresh="fetchReservations"/>
        {{ rows }}
    </div>
</template>

<script setup>
import CreateRoomReservationForm from './components/CreateRoomReservationForm.vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
const $q = useQuasar()
const rows = ref([])

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