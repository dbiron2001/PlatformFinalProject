<template>
  <!-- Full Page Scrollable Layout -->
  <div class="relative w-full min-h-screen bg-beige pt-[100px] flex items-start justify-center">
    <div class="relative w-full max-w-[750px] aspect-[750/646]">
      <!-- Floorplan Image -->
      <img
        :src="currentFloorImage"
        alt="Floor Layout"
        class="w-full h-auto object-contain pointer-events-none"
      />

      <!-- Room Overlays -->
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="room absolute z-10 cursor-pointer transition-all duration-200 rounded-[10px] backdrop-blur-sm bg-white/20 border border-white/50 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 hover:z-50 hover:border-2 hover:border-black hover:rounded-[15px]"
        :style="getOverlayStyle(room)"
        @click="openModal(room)"
      >
        <img :src="room.image" :alt="room.name" class="w-full h-full object-contain rounded-inherit" />
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="activeRoom"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
    >
      <div class="bg-white rounded-lg p-6 w-11/12 max-w-2xl relative">
        <button
          @click="activeRoom = null"
          class="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold mb-2">{{ activeRoom.name }}</h2>
        <p class="mb-2 text-sm text-gray-700">{{ activeRoom.description }}</p>
        <p class="text-sm text-gray-500 italic mb-4">
          Location: {{ activeRoom.location }}
        </p>
        <!-- Slideshow -->
        <div class="relative h-60 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            :src="activeRoom.photos[currentSlide]"
            alt="Room photo"
            class="object-contain h-full"
          />
          <button
            class="absolute left-2 bg-white bg-opacity-75 px-2 py-1 text-sm rounded"
            @click="prevSlide"
          >
            ‹
          </button>
          <button
            class="absolute right-2 bg-white bg-opacity-75 px-2 py-1 text-sm rounded"
            @click="nextSlide"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeRoom = ref(null)
const currentSlide = ref(0)
const currentFloor = ref('first')

// Floor Images
const floorImages = {
  first: '/images/firstFloor.png',
  second: '/images/secondFloor.png',
}
const currentFloorImage = computed(() => floorImages[currentFloor.value])

// Room Data
const roomsByFloor = {
  first: [
    {
      name: 'ICT-101',
      description: 'Computer lab with modern facilities.',
      location: 'North Wing, 1st Floor',
      image: '/images/ICT-101.png',
      photos: ['/images/ICT-101.png'],
      bounds: { top: 5.9, left: 17, width: 25.5, height: 27 }, // adjusted
    },
    {
      name: 'ICT-102',
      description: 'Second computer lab.',
      location: 'North-East Wing, 1st Floor',
      image: '/images/ICT-102.png',
      photos: ['/images/ICT-102.png'],
      bounds: { top: 5.5, left: 61, width: 22, height: 34.3 }, // added
    },
    {
      name: 'Spiral Stairs',
      description: 'Stairs to second floor.',
      location: 'Center Lobby',
      image: '/images/Spiral-Stairs.png',
      photos: [],
      bounds: { top: 33.5, left: 35, width: 22, height: 14.5 }, // adjusted
    },
    // Add other rooms similarly:
    {
      name: 'Faculty Office',
      description: 'Shared office for faculty members.',
      location: 'North Central',
      image: '/images/Faculty-Office.png',
      photos: [],
      bounds: { top: 5.6, left: 42.4, width: 18, height: 26.5 },
    },
    {
      name: "Dean's Office",
      description: 'Office of the Dean.',
      location: 'South-East Wing',
      image: '/images/Dean-Office.png',
      photos: [],
      bounds: { top: 39.7, left: 60.4, width: 36, height: 25 },
    },
    {
      name: 'Aquarium',
      description: 'Glass-walled multipurpose area.',
      location: 'South-West Wing',
      image: '/images/Aquarium.png',
      photos: [],
      bounds: { top: 37, left: 2.3, width: 31, height: 28 },
    },
  ],
  second: [
    {
      name: 'Library',
      description: 'Study space and resource center.',
      location: 'North Wing, 2nd Floor',
      photos: ['/images/library_1.jpg'],
      bounds: { top: 10, left: 10, width: 30, height: 30 },
    },
    {
      name: 'Back to 1st Floor',
      description: 'Stairs back to ground floor.',
      location: 'Central Lobby',
      photos: [],
      bounds: { top: 30, left: 30, width: 10, height: 15 },
      isBack: true,
    },
  ],
}

const rooms = computed(() => roomsByFloor[currentFloor.value])

// Modal Logic
const openModal = (room) => {
  if (room.isBack) {
    currentFloor.value = 'first'
    return
  }
  if (room.name === 'Spiral Stairs') {
    currentFloor.value = 'second'
    return
  }
  activeRoom.value = room
  currentSlide.value = 0
}

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}
const nextSlide = () => {
  if (activeRoom.value && currentSlide.value < activeRoom.value.photos.length - 1)
    currentSlide.value++
}

// Compute overlay style
const getOverlayStyle = (room) => {
  const { top, left, width, height } = room.bounds
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    height: `${height}%`,
  }
}
</script>

<style scoped>
.bg-beige {
  background-color: #F5E7D8;
}
</style>
