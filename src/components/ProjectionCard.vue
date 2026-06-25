<template>
  <div>
    <div class="pcard">
      <div class="phead">
        <span class="pt">Projected graduation rate</span>
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
              minWidth: total > 0 && cappedRate > 0 ? '4px' : '0'
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

    <div class="stgrid" style="margin-bottom: 1rem">
      <div class="sc">
        <p class="sl">Projected total</p>
        <p class="sv">{{ formattedTotal }}</p>
      </div>
      <div class="sc">
        <p class="sl">Program total</p>
        <p class="sv">{{ formattedProgramTotal }}</p>
      </div>
      <div class="sc">
        <p class="sl">Future class days</p>
        <p class="sv">{{ futureDays }}</p>
      </div>
    </div>

    <div class="dnote" :class="{ warn: note.warn }">
      <i v-if="note.warn" class="ti ti-alert-triangle" style="vertical-align: -2px; font-size: 13px"></i>
      {{ note.text }}
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
  total: {
    type: Number,
    default: 0
  },
  programTotal: {
    type: Number,
    default: 0
  },
  futureDays: {
    type: Number,
    default: 0
  },
  note: {
    type: Object,
    default: () => ({ text: '', warn: false })
  },
  threshold: {
    type: Number,
    default: 0.91
  },
  color: {
    type: Object,
    default: () => ({
      fill: '#888',
      text: 'var(--txt2)'
    })
  }
})

const displayRate = computed(() => props.rate.toFixed(1) + '%')

const thresholdPercent = computed(() => (props.threshold * 100) + '%')

const thresholdLabel = computed(() => Math.round(props.threshold * 100) + '%')

const fillWidth = computed(() => props.cappedRate + '%')

const formattedTotal = computed(() => props.total.toFixed(1) + 'h')

const formattedProgramTotal = computed(() => props.programTotal.toFixed(1) + 'h')
</script>
