<template>
  <client-only>
    <header class="navBar-container">
      <nav class="navBar-left">
        <button @click="toggleMenu" class="menu-button">☰</button>
        <div v-if="menuOpen" class="menu-column">
          <NuxtLink to="/about_us" class="menu-item">About Us</NuxtLink>
          <NuxtLink to="/options" class="menu-item">Options</NuxtLink>
          <!-- Add more routes as needed -->
        </div>
        <NuxtLink to="/" class="navBar-home">
          <img src="/navbar-logo.png" width="20" height="20" class="navBar-logo" />
          <span>CampusNavigator</span>
        </NuxtLink>
      </nav>
      <nav class="navBar-right">
        <!-- Search Bar -->
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="Search for destination..."
          class="navBar-search"
        />
      </nav>
    </header>
  </client-only>
</template>

<script setup>
import { ref } from 'vue'
import { searchMap } from '~/utils/searchMap'

const searchQuery = ref('')
const menuOpen = ref(false)
const router = useRouter() // ✅ Nuxt 3 auto-import

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleSearch = async () => {
  const query = searchQuery.value?.trim().toLowerCase()
  if (!query || !searchMap[query]) {
    alert('Destination not found.')
    return
  }

  const { path, targetId } = searchMap[query]
  await router.push(path)

  setTimeout(() => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target.classList.add('highlighted')
      setTimeout(() => target.classList.remove('highlighted'), 2000)
    }
  }, 500)
}
</script>

<style scoped>
.navBar-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
}

.navBar-left,
.navBar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navBar-left {
  flex-wrap: wrap;
  justify-content: flex-start;
}

.navBar-home {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  color: #2c3e50;
  transition: color 0.2s ease, background-color 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.navBar-home:hover {
  background-color: #e6f4ea;
  color: #1e7f4d;
}

.navBar-logo {
  margin-right: 0.5rem;
}

.navBar-search {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 200px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.navBar-search:hover {
  border-color: #a5d6a7;
  box-shadow: 0 0 5px rgba(165, 214, 167, 0.7);
}

.navBar-search:focus {
  border-color: #388e3c;
  outline: none;
  box-shadow: 0 0 8px rgba(56, 142, 60, 0.7);
}

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border-radius: 6px;
}

.menu-button:hover {
  background-color: #e6f4ea;
  color: #1e7f4d;
  transform: scale(1.05);
}

.menu-column {
  position: absolute;
  top: 70px;
  left: 2rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.menu-item {
  padding: 0.8rem 1rem;
  text-decoration: none;
  color: #2c3e50;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  background-color: #e6f4ea;
  color: #1e7f4d;
}

.menu-item:focus,
.menu-item:active {
  outline: none;
  background-color: #d4edda;
  color: #155724;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .navBar-container {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .navBar-left,
  .navBar-right {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .navBar-search {
    width: 100%;
    margin-top: 0.5rem;
    min-width: unset;
  }

  .menu-column {
    top: 60px;
    left: 1rem;
    right: 1rem;
    width: calc(100% - 2rem);
  }

  .menu-item {
    text-align: center;
  }
}

@media screen and (max-width: 480px) {
  .navBar-home span {
    font-size: 0.9rem;
  }

  .menu-button {
    padding: 0.4rem;
    font-size: 1.2rem;
  }
}

</style>


