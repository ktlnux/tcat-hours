<template>
  <div class="shell">
    <SideNav />
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import SideNav from './components/SideNav.vue'
</script>
