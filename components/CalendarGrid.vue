<template>
  <div class="space-y-4">
    <!-- View Controls -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Button @click="previousPeriod" variant="outline" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
        <h2 class="text-xl font-semibold">{{ currentPeriodLabel }}</h2>
        <Button @click="nextPeriod" variant="outline" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
        <Button @click="goToToday" variant="outline" size="sm"> Today </Button>
      </div>

      <div class="flex space-x-2">
        <Button
          @click="viewMode = 'day'"
          :variant="viewMode === 'day' ? 'default' : 'outline'"
          size="sm"
        >
          Day
        </Button>
        <Button
          @click="viewMode = 'week'"
          :variant="viewMode === 'week' ? 'default' : 'outline'"
          size="sm"
        >
          Week
        </Button>
        <Button
          @click="viewMode = 'month'"
          :variant="viewMode === 'month' ? 'default' : 'outline'"
          size="sm"
        >
          Month
        </Button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="border rounded-lg overflow-hidden bg-white">
      <!-- Day View -->
      <div v-if="viewMode === 'day'" class="p-4">
        <!-- Multi-day events bar at top -->
        <div v-if="getMultiDayEventsForDay(currentDate).length > 0" class="mb-4 space-y-1">
          <div
            v-for="item in getMultiDayEventsForDay(currentDate)"
            :key="item.id"
            class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 group relative flex justify-between items-center"
            @click="$emit('item-edit', item)"
          >
            <div class="flex-1">
              <div class="font-semibold">{{ item.title }}</div>
              <div class="text-xs opacity-90">
                {{ formatDateRange(item.startDate, item.endDate) }}
              </div>
            </div>
            <button
              @click.stop="$emit('item-delete', item)"
              class="opacity-0 group-hover:opacity-100 ml-2 text-white hover:text-red-200"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Hourly grid -->
        <div class="grid grid-cols-1 gap-2">
          <div
            v-for="hour in 24"
            :key="hour"
            class="border-b py-2 min-h-[60px] relative hover:bg-gray-50 cursor-pointer"
            @click="handleSlotClick(currentDate, hour - 1)"
          >
            <div class="text-xs text-gray-500 mb-1">{{ formatHour(hour - 1) }}</div>
            <div class="space-y-1" @click.stop>
              <div
                v-for="item in getSameDayItemsForHour(currentDate, hour - 1)"
                :key="item.id"
                class="bg-blue-100 border-l-4 border-blue-500 p-2 rounded text-sm cursor-pointer hover:bg-blue-200 group relative"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1" @click="$emit('item-edit', item)">
                    <div class="font-semibold">{{ item.title }}</div>
                    <div class="text-xs text-gray-600">{{ formatTime(item.startDate) }}</div>
                  </div>
                  <button
                    @click.stop="$emit('item-delete', item)"
                    class="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-else-if="viewMode === 'week'" class="overflow-x-auto">
        <div class="grid grid-cols-8 min-w-[800px]">
          <!-- Time column -->
          <div class="border-r">
            <div class="h-12 border-b"></div>
            <!-- Multi-day events header -->
            <div
              v-for="(_, idx) in getWeekMultiDayEvents()"
              :key="`multi-day-${idx}`"
              class="border-b h-8"
            ></div>
            <div
              v-for="hour in 24"
              :key="hour"
              class="border-b py-2 text-xs text-gray-500 text-center h-[60px]"
            >
              {{ formatHour(hour - 1) }}
            </div>
          </div>

          <!-- Day columns -->
          <div v-for="day in weekDays" :key="day.toISOString()" class="border-r">
            <div class="h-12 border-b p-2 text-center">
              <div class="text-xs text-gray-600">{{ formatDayName(day) }}</div>
              <div class="text-sm font-semibold" :class="{ 'text-blue-600': isToday(day) }">
                {{ day.getDate() }}
              </div>
            </div>

            <!-- Multi-day events bars -->
            <div
              v-for="item in getWeekMultiDayEvents()"
              :key="`${item.id}-${day.toISOString()}`"
              class="border-b h-8 relative"
            >
              <div
                v-if="isEventSpanningDay(item, day)"
                class="absolute inset-0 bg-blue-500 text-white text-xs px-2 flex items-center cursor-pointer hover:bg-blue-600 group"
                @click="$emit('item-edit', item)"
              >
                <span v-if="isEventStartDay(item, day)" class="font-semibold truncate">{{
                  item.title
                }}</span>
                <button
                  v-if="isEventStartDay(item, day)"
                  @click.stop="$emit('item-delete', item)"
                  class="opacity-0 group-hover:opacity-100 ml-auto text-white hover:text-red-200"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              v-for="hour in 24"
              :key="hour"
              class="border-b py-1 px-1 h-[60px] relative hover:bg-gray-50 cursor-pointer"
              @click="handleSlotClick(day, hour - 1)"
            >
              <div class="space-y-1" @click.stop>
                <div
                  v-for="item in getSameDayItemsForHour(day, hour - 1)"
                  :key="item.id"
                  class="bg-blue-100 border-l-2 border-blue-500 p-1 rounded text-xs cursor-pointer hover:bg-blue-200 group relative"
                >
                  <div class="flex justify-between items-start gap-1">
                    <div class="flex-1 min-w-0" @click="$emit('item-edit', item)">
                      <div class="font-semibold truncate">{{ item.title }}</div>
                      <div class="text-xs text-gray-600">{{ formatTime(item.startDate) }}</div>
                    </div>
                    <button
                      @click.stop="$emit('item-delete', item)"
                      class="opacity-0 group-hover:opacity-100 flex-shrink-0 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-else class="p-4">
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <!-- Day headers -->
          <div
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="day"
            class="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
          >
            {{ day }}
          </div>

          <!-- Calendar days -->
          <div
            v-for="day in monthDays"
            :key="day.date.toISOString()"
            class="bg-white min-h-[120px] p-2 hover:bg-gray-50 cursor-pointer"
            :class="{
              'bg-gray-50': !day.isCurrentMonth,
              'ring-2 ring-blue-500': isToday(day.date),
            }"
            @click="handleSlotClick(day.date, 9)"
          >
            <div
              class="text-sm font-semibold mb-1"
              :class="{
                'text-gray-400': !day.isCurrentMonth,
                'text-blue-600': isToday(day.date),
              }"
            >
              {{ day.date.getDate() }}
            </div>
            <div class="space-y-1" @click.stop>
              <div
                v-for="item in getItemsForDay(day.date)"
                :key="item.id"
                class="bg-blue-100 border-l-2 border-blue-500 p-1 rounded text-xs hover:bg-blue-200 group relative"
              >
                <div class="flex justify-between items-start gap-1">
                  <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('item-edit', item)">
                    <div class="font-semibold truncate">{{ item.title }}</div>
                    <!-- No time shown in month view -->
                  </div>
                  <button
                    @click.stop="$emit('item-delete', item)"
                    class="opacity-0 group-hover:opacity-100 flex-shrink-0 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

interface CalendarItem {
  id: string
  title: string
  startDate: string
  endDate: string
  [key: string]: any
}

interface Props {
  items: CalendarItem[]
}

const props = defineProps<Props>()
const emit = defineEmits(['item-edit', 'item-delete', 'slot-click'])

const viewMode = ref<'day' | 'week' | 'month'>('month')
const currentDate = ref(new Date())

const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'day') {
    return currentDate.value.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } else if (viewMode.value === 'week') {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  } else {
    return currentDate.value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }
})

const weekDays = computed(() => {
  const start = getWeekStart(currentDate.value)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    return day
  })
})

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

  const days = []
  const current = new Date(startDate)

  while (current <= endDate) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
    })
    current.setDate(current.getDate() + 1)
  }

  return days
})

const getWeekStart = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

const previousPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'day') {
    newDate.setDate(newDate.getDate() - 1)
  } else if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() - 7)
  } else {
    newDate.setMonth(newDate.getMonth() - 1)
  }
  currentDate.value = newDate
}

const nextPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'day') {
    newDate.setDate(newDate.getDate() + 1)
  } else if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() + 7)
  } else {
    newDate.setMonth(newDate.getMonth() + 1)
  }
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

const getItemsForDay = (date: Date) => {
  return props.items
    .filter((item) => {
      const itemStart = new Date(item.startDate)
      const itemEnd = new Date(item.endDate)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      // Show events that start on this day or span across this day
      return isSameDay(itemStart, date) || (itemStart <= dayEnd && itemEnd >= dayStart)
    })
    .slice(0, 3) // Limit to 3 items per day in month view
}

const getItemsForHour = (date: Date, hour: number) => {
  return props.items.filter((item) => {
    const itemStart = new Date(item.startDate)
    const itemEnd = new Date(item.endDate)

    // Create hour range for this specific date and hour
    const hourStart = new Date(date)
    hourStart.setHours(hour, 0, 0, 0)
    const hourEnd = new Date(date)
    hourEnd.setHours(hour, 59, 59, 999)

    // For week view: Show events that span through this hour
    // This allows multi-day trips to show across all days
    if (viewMode.value === 'week') {
      return itemStart <= hourEnd && itemEnd >= hourStart
    }

    // For day view: Only show in the START hour to avoid duplication
    return isSameDay(itemStart, date) && itemStart.getHours() === hour
  })
}

// Get events that span multiple days for a specific day
const getMultiDayEventsForDay = (date: Date) => {
  return props.items.filter((item) => {
    const itemStart = new Date(item.startDate)
    const itemEnd = new Date(item.endDate)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    // Check if it's a multi-day event spanning this day
    return !isSameDay(itemStart, itemEnd) && itemStart <= dayEnd && itemEnd >= dayStart
  })
}

// Get same-day events for a specific hour
const getSameDayItemsForHour = (date: Date, hour: number) => {
  return props.items.filter((item) => {
    const itemStart = new Date(item.startDate)
    const itemEnd = new Date(item.endDate)

    // Only show events that start AND end on the same day, at this hour
    return (
      isSameDay(itemStart, itemEnd) && isSameDay(itemStart, date) && itemStart.getHours() === hour
    )
  })
}

// Get all multi-day events for the week
const getWeekMultiDayEvents = () => {
  const weekStart = weekDays.value[0]
  const weekEnd = weekDays.value[6]

  return props.items.filter((item) => {
    const itemStart = new Date(item.startDate)
    const itemEnd = new Date(item.endDate)

    // Multi-day events that overlap with the week
    return (
      !isSameDay(itemStart, itemEnd) &&
      itemStart <=
        new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate(), 23, 59, 59) &&
      itemEnd >=
        new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate(), 0, 0, 0)
    )
  })
}

// Check if an event spans a specific day
const isEventSpanningDay = (item: CalendarItem, day: Date) => {
  const itemStart = new Date(item.startDate)
  const itemEnd = new Date(item.endDate)
  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)

  return itemStart <= dayEnd && itemEnd >= dayStart
}

// Check if an event starts on a specific day
const isEventStartDay = (item: CalendarItem, day: Date) => {
  const itemStart = new Date(item.startDate)
  return isSameDay(itemStart, day)
}

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

const formatHour = (hour: number) => {
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour} ${ampm}`
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const formatDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const handleSlotClick = (date: Date, hour: number) => {
  // Create a new date with the specific hour
  const slotDate = new Date(date)
  slotDate.setHours(hour, 0, 0, 0)
  emit('slot-click', slotDate)
}
</script>
