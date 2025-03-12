<template>  
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
           v-if="props.id"
            class="w-full"
            color="red-8"
            label="Deletar"
            @click="deleteReservation"
            :loading="model.isLoading"
          />
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
 
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CustomInputTime from 'src/components/CustomInputTime.vue'
import { onMounted, reactive, ref, inject, computed } from 'vue'
 
const rules = inject('rules')

const $q = useQuasar()
const props = defineProps(['id', 'description', 'roomId','date','startTime','endTime'])

const optionRooms = ref([])

const emit = defineEmits(['closeDialog', 'refresh'])

const model = reactive({ 
  id: null,
  description:  null,
  room: null,
  date:  null,
  startTime: null,
  endTime:  null,
  isLoading: false, 
})

async function deleteReservation() {
  await api
    .delete(`v1/reservation/${props.id}`)
    .then(() => {
      $q.notify({
        message: 'Agendamento excluído com sucesso',
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


async function onSubmit() {
  model.isLoading = true

  if(props.id){
    await api
    .put(`v1/reservation/${props.id}`, {
      description: model.description,
      roomId: model.room.value,
      date: model.date,
      startTime: model.startTime,
      endTime: model.endTime,
    }).then(() => {
      $q.notify({
        message: 'Agendamento alterado com sucesso',
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

    return 
  }
  await api
    .post('/v1/reservation', {
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
  model.id = null
  model.description = ''
  model.room = null
  model.date = null
  model.startTime = null
  model.endTime = null
  model.isLoading = false
  emit('closeDialog')
  emit('refresh')
}

const isToday = computed(() => {
  if (!model.date) {
    return true
  }
  const now = new Date()
  const date = new Date(`${model.date}T00:00:00`)
  now.setHours(0, 0, 0, 0)

  return now.getTime() == date.getTime()
})


onMounted(async () => {
  const response = await api.get('/v1/rooms')
  const { rooms } = response.data
  optionRooms.value = rooms.map((e) => ({ label: e.name, value: e.id }))


  if(props.id){
    model.id = props.id
    model.description = props.description;
    model.room = optionRooms.value.find(room =>room.id == props.roomId);
    model.date = props.date;
    model.startTime = props.startTime
    model.endTime = props.endTime
  }
 
})
</script>
<style scoped>
.card-form {
  width: 100%;
  max-width: 500px;
}
</style>
