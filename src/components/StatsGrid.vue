<template>
  <div class="stgrid">
    <div class="sc">
      <p class="sl">Possible hours</p>
      <p class="sv">{{ possibleHours ?? '—' }}</p>
    </div>
    <div class="sc">
      <p class="sl">Days elapsed</p>
      <p class="sv">{{ daysElapsed ?? '—' }}</p>
    </div>
    <div class="sc">
      <p class="sl">Days remaining</p>
      <p class="sv">{{ daysRemaining > 0 ? daysRemaining : '—' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  possibleHours: {
    type: String,
    default: null
  },
  daysElapsed: {
    type: [Number, String],
    default: null
  },
  daysRemaining: {
    type: Number,
    default: 0
  }
})
</script>
