<template>
    <Navbar />
   <Gallery />
</template>
<script setup>
import { ref } from 'vue'
import Navbar from '/components/Ui/Navbar.vue'
import Gallery from '/components/Ui/Gallery.vue'

const searchQuery = ref('')
</script><!-- v-model="searchQuery"-->
 <style>
    /* * {
        outline: red solid 1px;
    } */
</style>