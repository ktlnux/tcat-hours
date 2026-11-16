<template>
  <div>
    <div class="enr-head">
      <span class="enr-t">{{ title }}</span>
      <span class="enr-h">{{ hint }}</span>
    </div>
    <div class="sgrid">
      <button
        v-for="sem in semesters"
        :key="sem.key"
        class="sbtn"
        :class="{ act: modelValue === sem.key }"
        @click="$emit('update:modelValue', sem.key)"
      >
        <span class="rdot"></span>
        <span class="scon">
          <span class="sn">{{ sem.name }}</span>
          <span class="sd">{{ sem.dateRange }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  semesters: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'When did you start the program?'
  },
  hint: {
    type: String,
    default: 'Select your enrollment semester — this sets your total program hours.'
  }
})

defineEmits(['update:modelValue'])
</script>
