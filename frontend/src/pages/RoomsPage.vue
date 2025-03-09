<template>
   <q-dialog v-model="dialog.open">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cadastrar uma nova sala</div>
        </q-card-section>
 <q-form
          @submit="onSubmit"
          @reset="onReset"
        >

        <q-card-section class="q-pt-none">

              <q-input v-model="email" label="name" :rules="[rules.required, rules.minLenght]" />
              <q-input v-model="password" label="Senha" type="password" />


              <q-btn class="q-mt-xs" style="width: 100%;" type="submit">Entrar</q-btn>


        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Salvar" color="primary" v-close-popup type="submit" />
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>

  <div class="rooms-page">
    <q-btn class="btn" @click="openDialog">Nova Sala</q-btn>
    <div class="q-pa-md">
      <q-table title="Salas" :rows="rows" :columns="columns" row-key="name" />
    </div>
  </div>
</template>

<script setup >
import { useQuasar  } from 'quasar'
import { api } from 'src/boot/axios'
import rules from 'src/utils/rules'
import {  ref } from 'vue'

const $q = useQuasar()

const dialog = ref({})


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

function openDialog({id = null, name = ''}) {
  dialog.value = {
    open: true,
    id: id,
    name: name
  }
}

function onSubmit() {

}
</script>

<style scoped>
.btn {
  display: flex ;
  margin-left: auto;
}</style>
