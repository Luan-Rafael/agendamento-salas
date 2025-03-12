<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-lg row">
      <q-btn no-caps dense @click="$emit('today')"> Hoje </q-btn>
      <q-btn no-caps dense @click="$emit('prev')"> &lt; Anterior </q-btn>
      <q-btn no-caps dense @click="$emit('next')"> Próximo &gt; </q-btn>
    </div>
  </div>
</template>
