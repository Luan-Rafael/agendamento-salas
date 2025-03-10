<template>
  <q-dialog v-model="dialogIsOpen" @before-hide="$emit('closeModal')">
    <q-card>
      <q-card-section>
        <div class="text-h6">Cadastrar uma nova sala</div>
      </q-card-section>
      <q-form @submit="onSubmit" @reset="onReset">
        <q-card-section class="q-pt-none">
          <q-input v-model="id" label="ID" readonly v-if="id" />
          <q-input v-model="name" label="name" :rules="[rules.required, rules.minLenght]" />
          <q-btn class="q-mt-xs" style="width: 100%" type="submit">Salvar</q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Salvar" color="primary" v-close-popup type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import rules from 'src/utils/rules'
import { ref } from 'vue'

const props = defineProps(['id', 'name'])

const id = ref(props.id ?? '')
const name = ref(props.name ?? '')

const dialogIsOpen = ref(true)

function onSubmit() {}
function onReset() {}
</script>
