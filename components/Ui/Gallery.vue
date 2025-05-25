<template>
  <div class="gallery-container" ref="galleryRef">
    <div
      v-for="(location, index) in locations"
      :key="location.id"
      class="gallery-item"
      :class="{
        expanded:
          expandedIndex === index ||
          (isCollapsing && index === lastExpandedIndex),
        dimmed: expandedIndex !== null && expandedIndex !== index,
      }"
      @click.stop="expandItem(index)"
      :style="expandedIndex === index || (isCollapsing && index === lastExpandedIndex) ? expandedStyles : {}"
    >
      <img :src="location.image" :alt="location.name" />
      <div v-if="expandedIndex === index" class="details">
        <NuxtLink
          :to="`/${location.id}`"
          class="location-name"
          @click.stop
        >
          {{ location.name }}
        </NuxtLink>
        <p>{{ location.description }}</p>
      </div>
      <div v-if="expandedIndex !== index" class="gallery-label">
        <p>{{ location.name }}</p>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="expandedIndex !== null"
    class="overlay"
    @click="collapseItem(expandedIndex)"
  ></div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const expandedIndex = ref(null);
const lastExpandedIndex = ref(null);
const isCollapsing = ref(false);
const galleryRef = ref(null);
const expandedStyles = reactive({});
const locations = ref([
  {
    id: "vsu_library",
    name: "Campus Library",
    image: "/images/library.jpg",
    description: "The central hub for study and research."
  },
  {
    id: "vsu_dcst",
    name: "Department of Computer Science And Technology Building",
    image: "/images/dcst.jpg",
    description: "Code and Grind, free wifi for all."
  },
  {
    id: "vsu_ihk",
    name: "Institute of Human Kinetics",
    image: "/images/dcst.jpg",
    description: "Stay fit and healthy on campus."
  }
]);

watch(expandedIndex, (newVal) => {
  document.body.style.overflow = newVal !== null ? 'hidden' : '';
});

async function expandItem(index) {
  if (expandedIndex.value === index) {
    collapseItem(index);
    return;
  }

  const item = galleryRef.value.querySelectorAll('.gallery-item')[index];
  const rect = item.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const expandedHeight = windowHeight * 0.8;

  const isMobilePortrait = windowWidth <= 768 && windowHeight > windowWidth;

  // Base top value: center of the viewport
  let top = scrollTop + (windowHeight - expandedHeight) / 2;

  if (isMobilePortrait) {
    const itemCenter = rect.top + scrollTop + rect.height / 2;
    const viewportCenter = scrollTop + windowHeight / 2;

    const distanceBelowCenter = itemCenter - viewportCenter;

    // Shift upward based on how far below center the item is
    const upwardOffset = Math.min(distanceBelowCenter * 0.8, 150); // Cap to avoid over-shifting

    top = top - upwardOffset;

    // Make sure we don't go off-screen
    if (top < scrollTop + 20) {
      top = scrollTop + 20;
    }
  } else {
    // On desktop or landscape: expand near original Y position
    let itemTop = rect.top + scrollTop - 40;
    if (itemTop + expandedHeight > scrollTop + windowHeight) {
      itemTop = scrollTop + windowHeight - expandedHeight - 20;
    }
    if (itemTop < scrollTop + 20) {
      itemTop = scrollTop + 20;
    }
    top = itemTop;
  }

  expandedStyles.transition = 'all 0.3s ease-in-out';
  expandedStyles.top = '50%';
  expandedStyles.left = '50%';
  expandedStyles.width = '80vw';
  expandedStyles.height = '80vh';
  expandedStyles.transform = 'translate(-50%, -50%)';
  expandedStyles.position = 'fixed'; // Key difference
  expandedStyles.zIndex = 999;

  expandedIndex.value = index;
  lastExpandedIndex.value = index;

  await nextTick();

  // Optional: scroll so it's clearly in view
  window.scrollTo({
    top: top - 20,
    behavior: 'smooth'
  });
}

async function collapseItem(index) {
  if (!galleryRef.value || isCollapsing.value) return;

  isCollapsing.value = true;
  const item = galleryRef.value.querySelectorAll('.gallery-item')[index];
  const rect = item.getBoundingClientRect();

  expandedStyles.position = 'absolute';
  expandedStyles.top = `${rect.top + window.scrollY}px`;
  expandedStyles.left = `${rect.left + window.scrollX}px`;
  expandedStyles.width = `${rect.width}px`;
  expandedStyles.height = `${rect.height}px`;
  expandedStyles.transform = 'none';

  await new Promise((resolve) => setTimeout(resolve, 300));

  expandedIndex.value = null;
  isCollapsing.value = false;
  Object.assign(expandedStyles, {});
  document.body.style.overflow = ''; // Restore scroll
}
</script>

<style scoped>
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  position: relative;
  min-height: calc(100vh - 70px);
  background-color: #f4f7f9;
}

.gallery-item {
  position: relative;
  width: 320px;
  height: 270px;
  cursor: pointer;
  background: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(34, 34, 34, 0.3);
  overflow: hidden;
  transition: transform 0.5s ease-in-out;
  z-index: 1;
  opacity: 0.9;
  margin: 0 auto;
}

.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(88, 240, 131, 0.5);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  transition: transform 0.5s ease-in-out;
}

.gallery-item.expanded {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vh;
  z-index: 999;
  display: flex;
  flex-direction: column-reverse; /* Ensure details appear below the image */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.gallery-item.expanded img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.75);
  border-radius: 15px;
}

.details {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  padding: 30px;
  border-radius: 15px;
  color: #222;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 30%;
  width: 100%;
}

.location-name {
  font-size: 1.4em;
  font-weight: bold;
  color: green;
  text-decoration: none;
  margin-bottom: 10px;
}

.location-name:hover {
  text-decoration: underline;
}

.details p {
  margin-top: 5px;
  font-size: 1em;
  line-height: 1.4;
  color: #222;
}

.gallery-label {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 1em;
  z-index: 10;
}

.gallery-item.dimmed {
  opacity: 0.4;
  pointer-events: none;
  filter: blur(5px);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 998;
  cursor: pointer;
}
</style>
