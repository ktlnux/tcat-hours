<template>
  <div>
    <p class="intro-text"><span class="intro-em">Use this tool to see how your current time clock hours track against the program attendance requirements for Summer 2026.</span> To get started, <a href="https://47445.tcplusondemand.com/app/webclock/#/EmployeeLogOn/47445" target="_blank">go to the Time Clock</a> and log into dashboard. Paste your total hours into the box below.</p>
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
