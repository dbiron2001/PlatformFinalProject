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
        class="room absolute z-10 cursor-pointer transition-all duration-200 rounded-[5px] bg-white/20 shadow-2xl shadow-white-200/50 hover:bg-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 hover:z-50 hover:border-2 hover:border-black hover:rounded-[5px]"
        :style="getOverlayStyle(room)"
        @click="openModal(room)"
        >
        <img :src="room.image" :alt="room.name" class="w-full h-full object-contain rounded-inherit" />

        <!-- Label only for navigation overlays -->
        <div
            v-if="room.targetFloor"
            class="absolute top-0 left-0 right-0 text-[11px] bg-white bg-opacity-50
font-bold text-black text-center rounded px-2 py-[1px] pointer-events-none"
        >
            {{ room.label || formatFloorName(room.targetFloor) }}
        </div>
        </div>
    </div>


      <!-- Info Container (25% in Landscape, Below Floorplan in Portrait) -->
       
      <div class="w-full lg:w-1/4 lg:mt-0 mt-6 lg:pl-6 lg:pt-[10px] text-center lg:text-left portrait:pt-[0px] portrait:mt-[-60px]">
  
        <div class="mb-4 text-2xl font-bold z-20">
            {{ formatFloorName(currentFloor) }}
        </div>
    <!-- Scrollable Room List -->
        <div class="max-h-[450px] overflow-y-auto pr-2">
            <h3 class="text-xl font-bold mb-2">Library</h3>
        <p class="text-sm mb-4">
            A welcoming space for study and research, this three-story library offers a variety of rooms and seating options, including tables and couches for both individual and group study. The ground floor houses thesis books and the circulation and information counter for easy access to library services. Additionally, the mezzanine, located within the ground floor, contains Filipiniana books, providing a dedicated space for local and historical literature. The second floor holds circulation books, while the third floor is home to general reference materials such as atlases, dictionaries, and more.
        </p>
            <h2 class="text-base font-semibold mb-1">Rooms:</h2>

            <h3 class="font-medium mt-2">Ground Floor:</h3>
            <ul class="list-disc list-inside ml-4">
            <li>Office of the Chief Librarian</li>
            <li>Discussion Room 1</li>
            <li>Discussion Room 2</li>
            <li>Discussion Room 3</li>
            <li>Preservation and Bindery</li>
            <li>Pantry</li>
            <li>Stock Room</li>
            <li>Toilet</li>
            <li>Unlabelled Rooms</li>
            <li>Emergency Exit</li>
            </ul>

            <h3 class="font-medium mt-4">Mezzanine:</h3>
            <ul class="list-disc list-inside ml-4">
            <li>Culture and the ARTS Center</li>
            <li>Unlabelled Room</li>
            </ul>

            <h3 class="font-medium mt-4">2nd Floor:</h3>
            <ul class="list-disc list-inside ml-4">
            <li>Discussion Room 4</li>
            <li>Discussion Room 5</li>
            <li>Discussion Room 6</li>
            <li>Computer-Based Literature Service</li>
            <li>Technical Service Section</li>
            <li>Readers Service Section</li>
            <li>Electrical/Server Rooms</li>
            <li>Stock Room</li>
            <li>Toilet</li>
            <li>Unlabelled Rooms</li>
            <li>Emergency Exit</li>
            </ul>

            <h3 class="font-medium mt-4">3rd Floor:</h3>
            <ul class="list-disc list-inside ml-4">
            <li>Audio/Visual Room</li>
            <li>Graduating Studies</li>
            <li>Unlabelled Room</li>
            <li>Emergency Exit</li>
            </ul>
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

const activeRoom = ref(null)
const currentSlide = ref(0)
const currentFloor = ref('first')

// Floor Images
const floorImages = {
  first: '/images/lib/first/firstFloor.png',
  onePointFive: '/images/lib/first/1.5.png',
  second: '/images/lib/second/secondFloor.png',
  third: '/images/lib/third/thirdFloor.png',
}

const formatFloorName = (floorKey) => {
  const names = {
    first: '1st Floor',
    onePointFive: 'Mezzanine',
    second: '2nd Floor',
    third: '3rd Floor',
  }
  return names[floorKey] || floorKey
}


const currentFloorImage = computed(() => floorImages[currentFloor.value])

// Room Data
const roomsByFloor = {
  first: [
    {
      name: 'Stock Room',
      description: 'Storage room for various stuff.',
      location: 'North Wing, 1st Floor',
      image: '/images/lib/first/Stock Room.png',
      photos: ['/images/lib/ICT-101.png'],
      bounds: { top: 10, left: 13.6, width: 17.7, height: 15.5 }, // adjusted
    },
    {
      name: 'Pantry',
      description: 'pantry',
      location: 'North-East Wing, 1st Floor',
      image: '/images/lib/first/Pantry.png',
      photos: ['/images/lib/ICT-102.png'],
      bounds: { top: 68.5, left: 58.4, width: 15, height: 13.5 }, // added
    },
    {
      name: 'Information',
      description: 'Information and Help Desk.',
      location: 'Center Lobby',
      image: '/images/lib/first/Information.png',
      photos: [],
      bounds: { top: 60.6, left: 32.3, width: 16.2, height: 8.5}, // adjusted
    },
    // Add other rooms similarly:
    {
      name: 'Discussion Rooms',
      description: 'Private rooms available for quiet discussion environtments.',
      location: 'North Central',
      image: '/images/lib/first/Discussion Room.png',
      photos: [],
      bounds: { top: 11, left: 31.1, width: 66.3, height: 12.3 },
    },
    {
      name: "Circulation Counter",
      description: '',
      location: 'Center Lobby',
      image: '/images/lib/first/Circulation Counter.png',
      photos: [],
      bounds: { top: 41.7, left: 45, width: 11.8, height: 12.4 },
    },
    {
      name: 'Lockers',
      description: 'Personal Storage Lockers',
      location: 'Bottom Right Corner',
      image: '/images/lib/first/Lockers.png',
      photos: [],
      bounds: { top: 65, left: 16.5, width: 13.3, height: 8.8},
    },
    {
      name: 'Stairs',
      label: 'Go to 2nd floor',
      description: 'Glass-walled multipurpose area.',
      location: 'South-West Wing',
      image: '/images/lib/first/stairs.png',
      photos: [],
      targetFloor: 'second',
      bounds: { top: 48, left: 12.7, width: 9.5, height: 22.7 },
    },
    {
      description: 'Stairs to the Mezzanine.',
      location: 'North Wing',
      image: '/images/lib/first/stairs to 1.5r.png',
      photos: [],
      targetFloor: 'onePointFive',
      bounds: { top: 26, left: 24.3, width: 10, height: 6.5 },
    },
  ],
  onePointFive: [
    {
      name: 'Culture and Arts Center',
      description: 'Culture and Arts Exhibit.',
      location: 'North Wing, Mezzanine',
      image: '/images/lib/first/arts and culture.png',
      photos: ['/images/lib/ICT-101.png'],
      bounds: { top: 17.5, left: 21.3, width: 10, height: 8 }, // adjusted
    },
    {
      name: 'Stock Room',
      description: 'Storage room for various stuff.',
      location: 'North Wing, 1st Floor',
      image: '/images/lib/first/filipiniana bookshelves.png',
      photos: ['/images/lib/ICT-101.png'],
      bounds: { top: 20.5, left: 37, width: 26.5, height: 10 }, // adjusted
    },
    {
      label: "Main Lobby",
      description: 'Stairs back to the main lobby.',
      location: 'North WIng',
      image: '/images/lib/first/stairs to 1.5r.png',
      photos: [],
      isBack: true,
      targetFloor: 'first',
      bounds: { top: 26, left: 23.3, width: 10, height: 6.5 },
    },
  ],
  second: [
    {
      name: 'Computer-Based Literature Searches',
      description: 'Study space and resource center.',
      location: 'RIght Wing, 2nd Floor, right side of the central bookshelves',
      image: '/images/lib/second/cblspng',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 5, left: 15.4, width: 35.5, height: 27.5 },
    },
    {
      name: 'Computer-Based Literature Searches',
      description: 'Study space and resource center.',
      location: 'Right Wing, 2nd Floor, right side of the central bookshelves',
      image: '/images/lib/second/cbls.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 33.3, left: 73.7, width: 8.5, height: 7 },
    },
    {
      name: 'Technical Service Room',
      description: 'Resource center.',
      location: 'Right Wing, 2nd Floor, bottom right side of the central bookshelves',
      image: '/images/lib/second/tss.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 63.2, left: 71.7, width: 10.5, height: 9.5 },
    },
    {
      name: 'Readers Service Section',
      description: 'Resource center.',
      location: '2nd Floor, bottom side of the central bookshelves',
      image: '/images/lib/second/rss.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 63.2, left: 58.3, width: 7, height: 9.5 },
    },
    {
      name: 'Central Bookshelves',
      description: 'Study space and resource center.',
      location: 'Center, 2nd Floor',
      image: '/images/lib/second/2F Bookshelves.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 27.2, left: 38.5, width: 27.5, height: 27.5 },
    },
    {
      label: 'Back to 1st Floor',
      description: 'Stairs back to ground floor.',
      location: 'Central Lobby',
      image: '/images/lib/second/to1st.png' ,
      photos: [],
      bounds: { top: 58, left: 10.75, width: 13, height: 5 },
      isBack: true,
      targetFloor: 'first',
    },
    {
      name: '',
      description: 'Stairs back to ground floor.',
      location: 'Central Lobby',
      image: '/images/lib/second/to3rd.png',
      photos: [],
      bounds: { top: 52.5, left: 10.85, width: 13, height: 5 },
      isBack: true,
      targetFloor:'third',
    },
  ],
  third:[
    {
      name: 'Audio/Visual Room',
      description: 'Lecture and presentation space.',
      location: 'upper right corner.',
      image: '/images/lib/third/AV Room.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 11.5, left: 56.2, width: 25.8, height: 41.2 },
    },
    {
      name: 'Graduating Studies',
      description: 'Lecture and presentation space.',
      location: 'Bottom Right Corner.',
      image: '/images/lib/third/Graduating Studies.png',
      photos: ['/images/lib/ICT-201'],
      bounds: { top: 63, left: 69.4, width: 12.5, height: 9.65 },
    },
    {
      label: 'Back to 2nd Floor',
      description: 'Stairs back to 2nd floor.',
      location: 'Central Lobby',
      image: '/images/lib/third/back2nd.png' ,
      photos: [],
      bounds: { top: 52.7, left: 10.75, width: 13, height: 10.5 },
      isBack: true,
      targetFloor: 'second',
    },
  ]
}

const rooms = computed(() => roomsByFloor[currentFloor.value])

// Modal Logic
const openModal = (room) => {
  if (room.targetFloor) {
    currentFloor.value = room.targetFloor
    return
  }

  if (room.isBack && room.targetFloor) {
    currentFloor.value = room.targetFloor
    return
  }

  activeRoom.value = room
  currentSlide.value = 0
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
</style>
