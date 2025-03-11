<template>
  <div class="users-page">
    <div class="q-pa-md">
      <q-table title="Usuários" :rows="rows" :columns="columns" row-key="name" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { inject, ref } from 'vue'

const formatDateTimeToString = inject('formatDateTimeToString')

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
    name: 'email',
    required: true,
    label: 'E-mail',
    field: (row) => row.email,
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
    name: 'update_at',
    required: true,
    label: 'Data Alteração',
    field: (row) => formatDateTimeToString(row.update_at),
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
