<template>
  <div class="users-page">
    <div class="q-pa-md">
      <q-table title="Salas" :rows="rows" :columns="columns" row-key="name" />
    </div>
  </div>
</template>

<script setup >
import { useQuasar} from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const $q = useQuasar()


const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
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

const fetchUsers = async () => {
  const response = await api.get('/v1/users')
  const { users } = response.data
  rows.value = users
}

fetchUsers().catch((error) => {
  $q.notify({
    message: error.message,
    color: 'negative',
    position: 'bottom',
  })
})
</script>

<style scoped></style>
