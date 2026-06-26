<template>
  <div>
    <p class="intro-text"><span class="intro-em">Use this tool to see how your current time clock hours track against the program attendance requirements for Summer 2026.</span> To get started, paste your total hours into the box below.</p>

    <Teleport to="body">
      <div v-if="showInstructions" class="fb-overlay" @click.self="showInstructions = false">
        <div class="fb-modal instr-modal" role="dialog" aria-modal="true">
          <div class="fb-head">
            <span class="fb-title">Time Clock Instructions</span>
            <button class="fb-close" @click="showInstructions = false" aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
          </div>
          <p class="instr-body">To find your total hours this semester, <a href="https://47445.tcplusondemand.com/app/webclock/#/EmployeeLogOn/47445" target="_blank">go to the Time Clock</a> and log into dashboard.</p>
          <div class="instr-images">
            <img :src="`${base}tcat-hours-1.png`" alt="Time Clock instructions step 1" class="instr-img" />
            <img :src="`${base}tcat-hours-2.png`" alt="Time Clock instructions step 2" class="instr-img" />
          </div>
          <div class="fn">
            <button class="fb-trigger" @click="showInstructions = false" aria-label="Close">
              Go back
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="enr-head">
      <span class="enr-t">Total hours this semester</span>
      <span class="pt"><button class="instr-link" @click="showInstructions = true">Where do I find this?</button></span>
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
import { ref } from 'vue'

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

const showInstructions = ref(false)
const base = import.meta.env.BASE_URL
</script>
