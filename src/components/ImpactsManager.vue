<template>
  <div class="psub">
    <p class="lbl2">Real world impacts</p>
    <div class="arow">
      <span>Assume</span>
      <input
        type="number"
        v-model.number="hours"
        min="0.5"
        max="6.5"
        step="0.5"
        placeholder="hrs"
        style="width: 62px"
      >
      <span>hrs late</span>
      <input
        type="number"
        v-model.number="count"
        min="1"
        max="99"
        step="1"
        placeholder="#"
        style="width: 50px"
      >
      <span>times a</span>
      <select v-model="unit">
        <option value="week">week</option>
        <option value="month">month</option>
        <option value="semester">semester</option>
      </select>
      <button @click="handleAdd">+ Add</button>
    </div>
    <div class="ilist">
      <p v-if="modelValue.length === 0" class="ehint">No adjustments added.</p>
      <div
        v-for="rule in modelValue"
        :key="rule.id"
        class="iitem"
      >
        <div class="itxt">
          Assume {{ rule.hours }}h late {{ rule.count }} time{{ rule.count !== 1 ? 's' : '' }} a {{ rule.unit }}
        </div>
        <button class="dbtn" @click="$emit('remove', rule.id)" aria-label="Remove">
          <i class="ti ti-trash" style="font-size: 15px"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add', 'remove'])

const hours = ref(null)
const count = ref(null)
const unit = ref('week')

function handleAdd() {
  if (!hours.value || hours.value < 0.5 || hours.value > 6.5 || !count.value || count.value < 1) return
  emit('add', hours.value, count.value, unit.value)
  hours.value = null
  count.value = null
}
</script>
