<template>
  <div>
    <div class="enr-head">
      <span class="enr-t">When did you start the program?</span>
      <span class="enr-h">Select your enrollment semester — this sets your total program hours.</span>
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
  }
})

defineEmits(['update:modelValue'])
</script>
