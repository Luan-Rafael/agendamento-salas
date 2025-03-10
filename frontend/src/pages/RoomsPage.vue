<template>
  <create-room-form
    v-if="dialog.isOpen"
    :name="dialog.name"
    :id="dialog.id"
    @closeModal="openDialog"
  ></create-room-form>
  <div class="rooms-page">
    <q-btn class="btn" @click="() => openDialog({ isOpen: true })">Nova Sala</q-btn>
    <div class="q-pa-md">
      <q-table title="Salas" :rows="rows" :columns="columns" row-key="name" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import CreateRoomForm from './components/CreateRoomForm.vue'

const $q = useQuasar()

const dialog = ref({
  isOpen: false,
  id: null,
  name: '',
})

function openDialog({ isOpen = false, id = null, name = '' }) {
  console.log(isOpen)
  dialog.value = {
    isOpen,
    id,
    name,
  }
}
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
    name: 'createdAt',
    required: true,
    label: 'Data Registro',
    field: (row) => row.createdAt,
    sortable: true,
    align: 'left',
  },
  {
    name: 'updatedAt',
    required: true,
    label: 'Data Alteração',
    field: (row) => row.updatedAt,
    sortable: true,
    align: 'left',
  },
]

const rows = ref([])

const fetchRooms = async () => {
  const response = await api.get('/v1/rooms')
  const { rooms } = response.data
  rows.value = rooms
}

fetchRooms().catch((error) => {
  $q.notify({
    message: error.message,
    color: 'negative',
    position: 'bottom',
    timeout: 1000,
  })
})
</script>

<style scoped>
.btn {
  display: flex;
  margin-left: auto;
}
</style>
