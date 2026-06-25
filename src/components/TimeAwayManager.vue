<template>
  <div class="psub">
    <p class="lbl2">Planned time away</p>
    <div class="arow">
      <span>From</span>
      <input
        type="date"
        v-model="startDate"
        :min="semesterStart"
        :max="semesterEnd"
        @change="onStartChange"
      >
      <span>to</span>
      <input
        type="date"
        v-model="endDate"
        :min="minEnd"
        :max="semesterEnd"
      >
      <button @click="handleAdd">+ Add</button>
    </div>
    <div class="ilist">
      <p v-if="modelValue.length === 0" class="ehint">No time away added.</p>
      <div
        v-for="away in modelValue"
        :key="away.id"
        class="iitem"
      >
        <div class="itxt">
          {{ getAwayInfo(away).range }}
          <div class="isub">
            {{ getAwayInfo(away).futureDays }} future class day{{ getAwayInfo(away).futureDays !== 1 ? 's' : '' }} · −{{ getAwayInfo(away).hoursImpact }}
          </div>
        </div>
        <button class="dbtn" @click="$emit('remove', away.id)" aria-label="Remove">
          <i class="ti ti-trash" style="font-size: 15px"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  semesterStart: {
    type: String,
    required: true
  },
  semesterEnd: {
    type: String,
    required: true
  },
  getAwayInfo: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['add', 'remove'])

const startDate = ref('')
const endDate = ref('')

const minEnd = computed(() => startDate.value || props.semesterStart)

function onStartChange() {
  if (!endDate.value) {
    endDate.value = startDate.value
  }
}

function handleAdd() {
  if (!startDate.value) return
  emit('add', startDate.value, endDate.value)
  startDate.value = ''
  endDate.value = ''
}
</script>
