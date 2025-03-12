<template>
  <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
  <q-calendar ref="calendar" v-model="currentDate" :view="props.view" :hour24-format="true">
    <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
      <template v-for="event in getReservations(timestamp.date)" :key="event.id">
        <div
          v-if="event.time !== undefined"
          class="my-event"
          :class="badgeClasses(event, 'body')"
          :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
          @dblclick="
            () => {
              if (event.edit) {
                emit('openReservationForm', event)
              }
            }
          "
        >
          <div class="title q-calendar__ellipsis">
            {{ event.title }}
            <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
          </div>
        </div>
      </template>
    </template>
  </q-calendar>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  addToDate,
  isBetweenDates,
  parsed,
  parseTime,
  parseTimestamp,
  QCalendar,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { api } from 'src/boot/axios'
import { useQuasar, date } from 'quasar'
import NavigationBar from './NavigationBar.vue'
const $q = useQuasar()
const calendar = ref()
const props = defineProps(['view'])
const emit = defineEmits(['openReservationForm'])

const reservations = ref([])
const currentDate = ref(date.formatDate(new Date(), 'YYYY-MM-DD'))

const fetchReservations = async () => {
  const response = await api.get('/v1/reservations').catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'bottom',
      timeout: 1000,
    })
  })
  const { reservations: data } = response.data

  reservations.value = data.map((reservation, index) => {
    const colors = ['#00cbcc', '#00e5e5', '#00ffff', '#2196f3', '#6bbef9']
    const startDate = new Date(reservation.start_time)
    const endDate = new Date(reservation.end_time)
    const durationInMinutes = Math.floor((endDate - startDate) / 60000)
    return {
      id: reservation.id,
      title: reservation.description,
      details: '',
      date: parseTimestamp(reservation.start_time).date,
      time: `${parseTimestamp(reservation.start_time).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.start_time).minute.toString().padStart(2, '0')}`,
      startTime: `${parseTimestamp(reservation.start_time).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.start_time).minute.toString().padStart(2, '0')}`,
      endTime: `${parseTimestamp(reservation.end_time).hour.toString().padStart(2, '0')}:${parseTimestamp(reservation.end_time).minute.toString().padStart(2, '0')}`,
      duration: durationInMinutes,
      bgcolor: colors[index % colors.length],
      edit: reservation.edit,
    }
  })
}
const reservationsMap = computed(() => {
  const map = {}
  reservations.value.forEach((event) => {
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

function badgeClasses(event, type) {
  const isHeader = type === 'header'
  return {
    [`text-white`]: true,
    'full-width': !isHeader && (!event.side || event.side === 'full'),
    'left-side': !isHeader && event.side === 'left',
    'right-side': !isHeader && event.side === 'right',
    'rounded-border': true,
  }
}

function badgeStyles(event, _type, timeStartPos = null, timeDurationHeight = null) {
  const s = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
    s.backgroundColor = event.bgcolor
  }
  s['align-items'] = 'flex-start'
  return s
}

function getReservations(dt) {
  const events = reservationsMap.value[dt] || []

  if (events.length === 1 && events[0]) {
    events[0].side = 'full'
  } else if (events.length === 2 && events[0] && events[1]) {
    // this example does no more than 2 events per day
    // check if the two events overlap and if so, select
    // left or right side alignment to prevent overlap
    const start = parsed(events[0].date)
    if (start) {
      const startTime = addToDate(start, { minute: parseTime(events[0].time) })
      const endTime = addToDate(startTime, { minute: events[0].duration })
      const startTime2 = addToDate(parsed(events[1].date), {
        minute: parseTime(events[1].time),
      })
      const endTime2 = addToDate(startTime2, { minute: events[1].duration })
      if (
        isBetweenDates(startTime2, startTime, endTime, true) ||
        isBetweenDates(endTime2, startTime, endTime, true)
      ) {
        events[0].side = 'left'
        events[1].side = 'right'
      } else {
        events[0].side = 'full'
        events[1].side = 'full'
      }
    }
  }

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

// function onMoved(data) {
//   console.info('onMoved', data)
// }
// function onChange(data) {
//   console.info('onChange', data)
// }
// function onClickDate(data) {
//   console.info('onClickDate', data)
// }
// function onClickTime(data) {
//   console.info('onClickTime', data)
// }
// function onClickInterval(data) {
//   console.info('onClickInterval', data)
// }
// function onClickHeadIntervals(data) {
//   console.info('onClickHeadIntervals', data)
// }
// function onClickHeadDay(data) {
//   console.info('onClickHeadDay', data)
// }
onMounted(async () => {
  await fetchReservations()
})
</script>
<style lang="scss" scoped>
.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.text-white {
  color: white;
}

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.full-width {
  left: 0;
  width: calc(100% - 2px);
}

.left-side {
  left: 0;
  width: calc(50% - 3px);
}

.right-side {
  left: 50%;
  width: calc(50% - 3px);
}

.rounded-border {
  border-radius: 2px;
}
</style>
