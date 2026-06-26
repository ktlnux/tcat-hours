<template>
  <div>
    <div class="enr-head">
      <span class="enr-t">Total Hours in Time Clock</span>
    </div>
    <div class="inrow">
      <input
        class="hi"
        type="number"
        min="0"
        step="0.5"
        placeholder="0.0"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <span class="iu">hours logged</span>
    </div>
    <label class="chklbl">
      <input
        type="checkbox"
        :checked="includeToday"
        @change="$emit('update:includeToday', $event.target.checked)"
      >
      Include today in the calculation
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  includeToday: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'update:includeToday'])
</script>
