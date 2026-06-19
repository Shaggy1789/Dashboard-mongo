<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="bg-surface text-on-surface selection:bg-secondary/10 min-h-screen font-sans">
    <nav class="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/40 backdrop-blur-xl border-b border-white/20">
      <div class="flex items-center gap-12">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
            <span class="material-symbols-outlined text-white text-[24px]">analytics</span>
          </div>
          <span class="text-2xl font-bold tracking-tight text-on-surface">Atlas Monitor</span>
        </div>
        <div class="hidden md:flex items-center bg-[#f3f4f5] p-1.5 rounded-2xl border border-outline-variant/20">
          <router-link to="/" class="px-5 py-2 text-sm font-semibold rounded-xl transition-all" exact-active-class="bg-white text-secondary shadow-sm" active-class="bg-white text-secondary shadow-sm" :class="[route.path === '/' ? '' : 'text-on-surface-variant hover:text-on-surface']">Dashboard</router-link>
          <router-link to="/charts" class="px-5 py-2 text-sm font-medium rounded-xl transition-all" active-class="bg-white text-secondary shadow-sm" :class="[route.path.includes('/charts') ? '' : 'text-on-surface-variant hover:text-on-surface']">Reportes</router-link>
        </div>
      </div>
      <div class="flex items-center gap-6"></div>
    </nav>

    <main class="pt-32 pb-20 px-8 max-w-[1600px] mx-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
body {
  font-family: 'Geist', sans-serif;
  background-color: #f8f9fa;
  -webkit-font-smoothing: antialiased;
}
/* Scrollbar personalizado */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d9dadb; border-radius: 10px; }
</style>
