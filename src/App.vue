<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <keep-alive include="HomeView">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </AppLayout>
</template>
