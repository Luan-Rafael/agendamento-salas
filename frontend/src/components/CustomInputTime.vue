<template>
    <q-input mask="time" v-model="timeWithSeconds" v-bind="$attrs">
        <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="timeWithSeconds" format24h>
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                    </q-time>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const emit = defineEmits(['update:modelValue'])

const timeWithSeconds = ref('')

watch(timeWithSeconds, (value) => {
    emit('update:modelValue', value)
})
</script>