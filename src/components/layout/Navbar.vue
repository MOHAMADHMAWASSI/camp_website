<template>
  <nav
    :class="[
      'fixed w-full z-50 transition-all duration-300',
      isScrolled || isOpen ? 'bg-green-900 shadow-lg' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <Tent class="h-8 w-8 text-amber-400" />
            <span class="text-white font-bold text-xl">WildScape Camping</span>
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              $route.path === link.path ? 'text-amber-400' : 'text-white hover:text-amber-200'
            ]"
          >
            {{ $t(`nav.${link.name.toLowerCase()}`) }}
          </router-link>
          
          <LanguageSwitcher class="mr-4" />
          
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-900 bg-amber-400 hover:bg-amber-500 transition-colors duration-200"
          >
            {{ $t('nav.signIn') }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden space-x-4">
          <LanguageSwitcher />
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-amber-400 focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <Menu v-if="!isOpen" class="block h-6 w-6" />
            <X v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      :class="[
        'md:hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      ]"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-900">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'block px-3 py-2 rounded-md text-base font-medium',
            $route.path === link.path
              ? 'text-amber-400 bg-green-800'
              : 'text-white hover:bg-green-800 hover:text-amber-200'
          ]"
          @click="isOpen = false"
        >
          {{ $t(`nav.${link.name.toLowerCase()}`) }}
        </router-link>
        <router-link
          to="/login"
          class="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-800 hover:text-amber-200"
          @click="isOpen = false"
        >
          <User class="mr-2 h-5 w-5" />
          {{ $t('nav.signIn') }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Tent, Menu, X, User } from 'lucide-vue-next';
import LanguageSwitcher from '../LanguageSwitcher.vue';

const route = useRoute();
const isOpen = ref(false);
const isScrolled = ref(false);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cabins', path: '/cabins' },
  { name: 'Activities', path: '/activities' },
  { name: 'Map', path: '/map' },
  { name: 'Contact', path: '/contact' }
];

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>