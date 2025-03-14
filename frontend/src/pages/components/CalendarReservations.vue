<template>
  <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
  <q-calendar ref="calendar" locale="pt-BR" v-model="currentDate" :view="props.view" :hour24-format="true">
    <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
      <template v-for="event in getReservations(timestamp.date)" :key="event.id">
        <div
          v-if="event.time !== undefined"
          class="my-event rounded-border text-white" 
          :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight, getReservations(event.date))"
          @dblclick="() => openReservation(event)"
        >
          <div class="title">
          {{ event.title }}
          </div>
          <q-tooltip>{{event.description + ' - ' + event.time + ' - ' + event.details}}</q-tooltip>
        </div>
      </template>
    </template>
        <template #head-intervals="{ scope }"> 
            <div style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                font-size: 10px;
                font-weight: 700;
              ">
              <span>
                  Mês/Ano {{ date.formatDate(`${scope.timestamps[0].date}T00:00:00` , 'MM/YYYY') }}
                </span> 
            </div>
          </template>
  </q-calendar>
</template>

<script setup>
import { computed,  ref } from 'vue'
import {
  addToDate, 
  parseTimestamp,
  QCalendar,

} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css' 
import { date } from 'quasar'
import NavigationBar from './NavigationBar.vue'
const calendar = ref()
const props = defineProps(['view', 'reservations'])
const emit = defineEmits(['openReservationForm'])

const currentDate = ref(date.formatDate(new Date(), 'YYYY-MM-DD'))
 
function openReservation( reservation){ 
  emit('openReservationForm', reservation)
}

const reservationsMap = computed(() => {
  const map = {}
  props.reservations.forEach((event) => {
    if (!map[event.date]) {
      map[event.date] = []
    }
    map[event.date].push(event)

    if (event.days) {
      let timestamp = parseTimestamp(event.date)
      let days = event.days
      do {
        if (timestamp) {
          timestamp = addToDate(timestamp, { day: 1 })
          if (!map[timestamp.date]) {
            map[timestamp.date] = []
          }
          map[timestamp.date].push(event)
        }
      } while (--days > 0)
    }
  })
  return map
})
 
function badgeStyles(event, _type, timeStartPos = null, timeDurationHeight = null, allEvents = []) {
  const s = {}
  
  // Calculando a posição e altura do evento
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
    s.backgroundColor = event.bgcolor
  }
  
  let leftPosition = 0
  
  const overlappingEvents = allEvents.filter(otherEvent => {
    return timeStartPos(event.time) === timeStartPos(otherEvent.time);
  }).sort((a,b) => a.id - b.id);

  let dynamicWidth = 100

  if (overlappingEvents.length > 0) { 
     dynamicWidth = dynamicWidth / overlappingEvents.length;  
  }
 
  if (overlappingEvents.length > 0) {
    leftPosition = overlappingEvents.findIndex(e  => e.id === event.id ) * dynamicWidth
  }


  s['align-items'] = 'flex-start'
  s['left'] = `${leftPosition}%`
  s['width'] =  `calc(${dynamicWidth}% - 3px)`
  
  return s
}

function getReservations(dt) { 
  const events = reservationsMap.value[dt] || []

 

  return events
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
 

</script>
<style lang="scss" scoped>
.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;

  overflow: hidden;
  cursor: pointer;
  border: 1px solid #ccc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  font-weight: bold;
  color: black;
  white-space: nowrap;  
  max-width: 100%;  
}

.rounded-border {
  border-radius: 2px;
}
</style>
