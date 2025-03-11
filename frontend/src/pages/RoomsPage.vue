<template>
  <div class="flex column">
    <create-room-form @refresh="fetchRooms" />
    <div class="q-pa-md">
      <q-table title="Salas" :rows="rows" :columns="columns" row-key="id" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref, inject } from 'vue'
import CreateRoomForm from './components/CreateRoomForm.vue'

const formatDateTimeToString = inject('formatDateTimeToString')

const $q = useQuasar()

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Sala',
    field: (row) => row.name,
    sortable: true,
    align: 'left',
  },
  {
    name: 'created_at',
    required: true,
    label: 'Data Registro',
    field: (row) => formatDateTimeToString(row.created_at),
    sortable: true,
    align: 'left',
  },
  {
    name: 'updated_at',
    required: true,
    label: 'Data Alteração',
    field: (row) => row.updated_at,
    sortable: true,
    align: 'left',
  },
]

const rows = ref([])

const fetchRooms = async () => {
  const response = await api.get('/v1/rooms').catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'bottom',
      timeout: 1000,
    })
  })
  const { rooms } = response.data
  rows.value = rooms
}

fetchRooms()
</script>

<style scoped></style>
