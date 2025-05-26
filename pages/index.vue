<template>
  <Navbar />
  <Gallery />
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '/components/Ui/Navbar.vue'
import Gallery from '/components/Ui/Gallery.vue'

const searchQuery = ref('')
</script>

<style>
.b {
  background-color: #eed6cc;
}
</style>
