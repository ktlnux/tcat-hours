<template>
  <div class="pcard">
    <p class="ar-lbl">Attendance rate</p>
    <div class="phead">
      <span class="pt">% of possible hours logged to date</span>
      <span class="pp" :style="{ color: color.text }">{{ displayRate }}</span>
    </div>
    <div class="bwrap">
      <span class="nlbl" :style="{ left: thresholdPercent }">{{ thresholdLabel }}</span>
      <div class="btrack">
        <div
          class="bfill"
          :style="{
            width: fillWidth,
            background: color.fill,
            minWidth: hasData && cappedRate > 0 ? '4px' : '0'
          }"
        ></div>
        <div class="bnotch" :style="{ left: thresholdPercent }"></div>
      </div>
    </div>
    <div class="bscale">
      <span>0%</span>
      <span>100%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rate: {
    type: Number,
    default: 0
  },
  cappedRate: {
    type: Number,
    default: 0
  },
  threshold: {
    type: Number,
    default: 0.91
  },
  hasData: {
    type: Boolean,
    default: false
  },
  color: {
    type: Object,
    default: () => ({
      fill: '#888',
      text: 'var(--txt2)'
    })
  }
})

const displayRate = computed(() => {
  return props.hasData ? props.rate.toFixed(1) + '%' : '—'
})

const thresholdPercent = computed(() => {
  return (props.threshold * 100) + '%'
})

const thresholdLabel = computed(() => {
  return Math.round(props.threshold * 100) + '%'
})

const fillWidth = computed(() => {
  return props.cappedRate + '%'
})
</script>
