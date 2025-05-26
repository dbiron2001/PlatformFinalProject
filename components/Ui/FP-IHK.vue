<template>
  <!-- Full Page Scrollable Layout -->
   <p class="bg-beige text-sm italic text-gray-500 pl-20 pt-2.5">
  Note: Hover or click rooms/locations to view details and medias.
</p>

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
        :id="room.name.toLowerCase().replace(/\s+/g, '-')"
        class="room absolute z-10 cursor-pointer transition-all duration-200 rounded-[5px] bg-white/20 shadow-2xl shadow-white-200/50 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 hover:z-50 hover:border-2 hover:border-black hover:rounded-[5px]"
        :style="getOverlayStyle(room)"
        @click="openModal(room)"
        >

          <img :src="room.image" :alt="room.name" class="w-full h-full object-contain rounded-inherit" />
        </div>
      </div>

      <!-- Info Container (25% in Landscape, Below Floorplan in Portrait) -->
<div class="w-full lg:w-1/4 lg:mt-0 mt-6 lg:pl-6 lg:pt-[10px] text-center lg:text-left portrait:pt-[0px] portrait:mt-[-60px]">
<h3 class="text-xl font-bold mb-2">IHK (Institute for Human Kinetics)</h3>
  <!-- Scrollable Room List -->
  <div class="max-h-[450px] overflow-y-auto pr-2">
    <p class="text-sm mb-4">
      A dynamic space designed for movement and learning, this single-story, rectangular-shaped building features an open area at its center, providing a spacious and accessible environment. Surrounding this open space are essential facilities, including faculty rooms, a dedicated dance room, and classrooms tailored for sports education. Its layout fosters engagement and interaction, supporting both academic studies and physical training.
    </p>

    <h2 class="text-base font-semibold mb-1">Rooms & Facilities:</h2>
    <ul class="list-disc list-inside ml-4">
      <li>Faculty Office 1</li>
      <li>Faculty Office 2</li>
      <li>Faculty Office 3</li>
      <li>RM 101</li>
      <li>RM 102</li>
      <li>RM 103</li>
      <li>RM 104</li>
      <li>RM 105</li>
      <li>Dance Room</li>
      <li>Conference Room</li>
      <li>Physical Conditioning Room</li>
      <li>Equipment Area</li>
      <li>Toilet</li>
    </ul>

    <h3 class="font-medium mt-4">Location:</h3>
    <p class="text-sm mb-2 ml-4">
      Upper Campus, next to the Gym and Upper Oval.
    </p>
  </div>
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
import { onMounted} from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();

const currentFloor = ref(route.query.floor || 'first');

// Watch for route changes
watch(() => route.query.floor, (newFloor) => {
  if (newFloor) {
    currentFloor.value = newFloor;
    // Small delay to ensure DOM is ready before highlighting
    setTimeout(highlightRoom, 100);
  }
});

// Update highlightRoom to work with the current floor
const highlightRoom = () => {
  if (!route.query.target) return;
  
  const id = route.query.target.toLowerCase().replace(/\s+/g, '-');
  const el = document.getElementById(id);
  
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('highlighted-room');
    
    setTimeout(() => {
      el.classList.remove('highlighted-room');
    }, 5000);
  }
};

// Call highlightRoom on mounted
onMounted(() => {
  if (route.query.target) {
    highlightRoom();
  }
});

const props = defineProps({
  target: {
    type: String,
    default: ''
  }
})

const targetRoom = ref(props.target)

watch(() => props.target, (newTarget) => {
  targetRoom.value = newTarget
  highlightRoom()
})

// Room Data
const roomsByFloor = {
  first: [
    {
      name: 'Faculty Office 2',
      description: 'Office for the faculty and staff.',
      location: 'North Wing, ground floor.',
      image: '/images/ihk/FO2.png',
      photos: ['/images/ihk/ICT-101.png'],
      bounds: { top: 11.4, left: 12.8, width: 12.6, height: 11 }, // adjusted
    },
    {
      name: 'Male CR',
      description: 'Male Comfort Room.',
      location: 'North Wing, ground floor',
      image: '/images/ihk/male.png',
      photos: ['/images/ihk/ICT-102.png'],
      bounds: { top: 11.4, left: 28.4, width: 9.9, height: 11 }, // added
    },
    {
      name: 'Equipment',
      description: 'Equipment Storage room.',
      location: 'North Central',
      image: '/images/ihk/equip.png',
      photos: [],
      bounds: { top: 11.4, left: 37.9, width: 14.8, height: 8},
    },
    {
      name: 'Female CR',
      description: 'Female Comfort room.',
      location: 'North Central',
      image: '/images/ihk/female.png',
      photos: [],
      bounds: { top: 12.7, left: 56.5, width: 10.2, height: 8},
    },
    {
      name: 'Physical Conditioning Room',
      description: 'Gym.',
      location: 'North Wing, ground floor.',
      image: '/images/ihk/physcon.png',
      photos: [],
      bounds: { top: 12.7, left: 66.3, width: 15.7, height: 9.8},
    },

    {
      name: "RM-105",
      description: 'Lecture Room RM-105.',
      location: 'East Wing, ground floor',
      image: '/images/ihk/rm105.png',
      photos: [],
      bounds: { top: 22.3, left: 69.5, width: 12.4, height: 9 },
    },
    {
      name: "Faculty Office 3",
      description: 'Dedicated Office for Faculty Members.',
      location: 'East Wing, ground floor',
      image: '/images/ihk/FO3.png',
      photos: [],
      bounds: { top: 31.2, left: 71.6, width: 10.3, height: 7 },
    },
    {
      name: "Conference Room",
      description: 'Dedicated room for important meetings.',
      location: 'East Wing, ground floor',
      image: '/images/ihk/confe.png',
      photos: [],
      bounds: { top: 38, left: 69.5, width: 12.4, height: 10.1 },
    },
    {
      name: "Dance Room",
      description: 'Dance space and other usage.',
      location: 'East South Wing, ground floor',
      image: '/images/ihk/dance.png',
      photos: [],
      bounds: { top: 47.9, left: 69.5, width: 12.4, height: 10.1 },
    },
    {
      name: "RM-101",
      description: 'Lecture Room RM-101.',
      location: 'South Wing, ground floor',
      image: '/images/ihk/rm101.png',
      photos: [],
      bounds: { top: 51.2, left: 53.8, width: 15.9, height: 10.1 },
    },
    {
      name: 'RM-104',
      description: 'Lecture Room RM-104.',
      location: 'West Wing, ground floor.',
      image: '/images/ihk/rm104.png',
      photos: [],
      bounds: { top: 22.1, left: 12.8, width: 12.6, height: 9 },
    },

    {
      name: 'RM-103',
      description: 'Lecture Room RM-103.',
      location: 'West Wing, ground floor.',
      image: '/images/ihk/rm103.png',
      photos: [],
      bounds: { top: 31, left: 12.8, width: 12.6, height: 9 },
    },
    {
      name: 'RM-102',
      description: 'Lecture Room RM-102.',
      location: 'West Wing, ground floor.',
      image: '/images/ihk/rm102.png',
      photos: [],
      bounds: { top: 39.7, left: 12.8, width: 12.6, height: 9 },
    },
    {
      name: 'Faculty Office 1',
      description: 'Dedicated Office for Faculty Members.',
      location: 'South West Wing, ground floor.',
      image: '/images/ihk/FO1.png',
      photos: [],
      bounds: { top: 48.6, left: 16.6, width: 24.8, height: 12.8 },
    },
  ],
}

const rooms = computed(() => roomsByFloor[currentFloor.value])

// Modal Logic
const openModal = (room) => {
  // Remove floor-switch logic if the building is single-floor
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
  background-color: #eed6cc;
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
.highlighted-room {
  animation: pulse 2s infinite;
  border: 2px solid #ff0000 !important;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.7) !important;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
</style>
