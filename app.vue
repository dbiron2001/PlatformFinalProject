<template>
  <Head>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter" rel="stylesheet"/>
  </Head>
  <div>
    <NavBar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Campus Navigator | Visayas State University",
  link: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",  // Explicit size declaration
      href: "./website_logo.png", // Ensure the path is correct
    },
    
  ],
  meta: [
    {
      name: "description",
      content: "Visayas State University website",
    },
  ],
});
</script>
