<template>
  <NavBar />
  <FloorPlan 
    :target="route.query.target"
    :default-floor="route.query.floor"
  />
</template>

<script setup>
import { useRoute } from 'vue-router';
import NavBar from '~/components/Ui/NavBar.vue'
import FloorPlan from '~/components/Ui/FP-Library.vue';
const route = useRoute();
</script>