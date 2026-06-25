<template>
  <div
    class="sbox"
    :style="{
      background: color.bg,
      borderColor: color.border
    }"
  >
    <i
      class="ti sico"
      :class="color.icon"
      :style="{ color: color.text }"
    ></i>
    <p class="smsg" :style="{ color: color.text }">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  color: {
    type: Object,
    default: () => ({
      bg: 'var(--bg2)',
      border: 'var(--brd)',
      text: 'var(--txt2)',
      icon: 'ti-info-circle'
    })
  }
})
</script>
