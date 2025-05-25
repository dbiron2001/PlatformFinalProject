<template>
  <!-- Full Page Scrollable Layout -->
  <div class="relative w-full min-h-screen bg-beige pt-[20px] flex items-start justify-center">
    <div class="w-full max-w-[1200px] flex flex-col lg:flex-row">
      <!-- Floorplan Container (75% in Landscape) -->
      <div class="w-full lg:w-3/5 relative aspect-[750/646] lg:ml-[20px] lg:mr-[20px] lg:mb-[-100px]">
        <img
          :src="currentFloorImage"
          alt="Floor Layout"
          class="w-full h-auto object-contain pointer-events-none"
        />

        <!-- Room Overlays -->
        <div
          v-for="(room, index) in rooms"
          :key="index"
          class="room absolute z-10 cursor-pointer transition-all duration-200 rounded-[10px] bg-white/20 border border-white/50 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 hover:z-50 hover:border-2 hover:border-black hover:rounded-[15px]"
          :style="getOverlayStyle(room)"
          @click="openModal(room)"
        >
          <img :src="room.image" :alt="room.name" class="w-full h-full object-contain rounded-inherit" />
        </div>
      </div>

      <!-- Info Container (25% in Landscape, Below Floorplan in Portrait) -->
      <div class="w-full lg:w-1/4 lg:mt-0 mt-6 lg:pl-6 lg:pt-[10px] text-center lg:text-left portrait:pt-[0px] portrait:mt-[-60px]">
        <h3 class="text-xl font-bold mb-2">Building Information</h3>
        <p class="text-sm">Here you can add detailed building info like departments, floor names, and any important information regarding the layout.</p>
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
  first: '/images/dcst/firstFloor.png',
  second: '/images/dcst/secondFloor.png',
}
const currentFloorImage = computed(() => floorImages[currentFloor.value])

// Room Data
const roomsByFloor = {
  first: [
    {
      name: 'ICT-101',
      description: 'Computer lab with modern facilities.',
      location: 'North Wing, 1st Floor',
      image: '/images/dcst/ICT-101.png',
      photos: ['/images/dcst/ICT-101.png'],
      bounds: { top: 5.9, left: 17, width: 25.5, height: 27 }, // adjusted
    },
    {
      name: 'ICT-102',
      description: 'Second computer lab.',
      location: 'North-East Wing, 1st Floor',
      image: '/images/dcst/ICT-102.png',
      photos: ['/images/dcst/ICT-102.png'],
      bounds: { top: 5.5, left: 61, width: 22, height: 34.3 }, // added
    },
    {
      name: 'Spiral Stairs',
      description: 'Stairs to second floor.',
      location: 'Center Lobby',
      image: '/images/dcst/Spiral-Stairs.png',
      photos: [],
      bounds: { top: 33.5, left: 35, width: 22, height: 14.5 }, // adjusted
    },
    // Add other rooms similarly:
    {
      name: 'Faculty Office',
      description: 'Shared office for faculty members.',
      location: 'North Central',
      image: '/images/dcst/Faculty-Office.png',
      photos: [],
      bounds: { top: 5.6, left: 42.3, width: 18.5, height: 26.6 },
    },
    {
      name: "Dean's Office",
      description: 'Office of the Dean.',
      location: 'South-East Wing',
      image: '/images/dcst/Dean-Office.png',
      photos: [],
      bounds: { top: 39.7, left: 60.4, width: 36, height: 25 },
    },
    {
      name: 'Aquarium',
      description: 'Glass-walled multipurpose area.',
      location: 'South-West Wing',
      image: '/images/dcst/Aquarium.png',
      photos: [],
      bounds: { top: 37, left: 2.4, width: 31.3, height: 28 },
    },
  ],
  second: [
    {
      name: 'ICT-201A/201B',
      description: 'Study space and resource center.',
      location: 'North Wing, 2nd Floor',
      image: '/images/dcst/ICT-201.png',
      photos: ['/images/dcst/ICT-201'],
      bounds: { top: 5, left: 15.4, width: 35.5, height: 27.5 },
    },
    {
      name: 'ICT-202',
      description: 'Study space and resource center.',
      location: 'North Wing, 2nd Floor',
      image: '/images/dcst/ICT-202.png',
      photos: ['/images/dcst/ICT-201'],
      bounds: { top: 5.7, left: 50.8, width: 31.7, height: 27 },
    },
    {
      name: 'ICT-203',
      description: 'Study space and resource center.',
      location: 'North Wing, 2nd Floor',
      image: '/images/dcst/ICT-203.png',
      photos: ['/images/dcst/ICT-201'],
      bounds: { top: 32.3, left: 58.1, width: 37, height: 33.2 },
    },
    {
      name: 'Back to 1st Floor',
      description: 'Stairs back to ground floor.',
      location: 'Central Lobby',
      image: '/images/dcst/Spiral-Stairs2nd.png',
      photos: [],
      bounds: { top: 33.6, left: 32.7, width: 23, height: 16.5 },
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

@media (max-width: 1024px) {
  /* In portrait, info section moves below */
  .lg\:flex-row {
    flex-direction: column;
  }

  .lg\:w-3\/4 {
    width: 100%;
  }

  .lg\:w-1\/4 {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  /* Landscape */
  .lg\:w-3\/4 {
    width: 75%;
  }

  .lg\:w-1\/4 {
    width: 25%;
  }

  .lg\:pl-6 {
    padding-left: 1.5rem;
  }
}
</style>
