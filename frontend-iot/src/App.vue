<script setup>
import { useRoute } from 'vue-router'

// Declaramos la variable route para saber en qué página estamos
const route = useRoute()
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">🛰️</div>
        <h2>Sensores<span>Hub</span></h2>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item">🏠 Resumen</router-link>
        <router-link to="/devices" class="nav-item">📡 Dispositivos</router-link>
        <router-link to="/charts" class="nav-item">📊 Gráficas</router-link>
        <router-link to="/history" class="nav-item">📜 Historial (Filtros)</router-link>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <h1>{{ route.name }}</h1>
      </header>
      
      <div class="view-area">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --bg-dark: #09090b;
  --bg-card: #18181b;
  --primary: #22c55e;
  --text-main: #f4f4f5;
  --text-muted: #a1a1aa;
  --sidebar-width: 260px;
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, sans-serif; }
body { background-color: var(--bg-dark); color: var(--text-main); }

.app-container { display: flex; min-height: 100vh; }

.sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-card);
  border-right: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.sidebar-header { padding: 2rem; display: flex; align-items: center; gap: 10px; }
.logo-icon { font-size: 1.5rem; }
.sidebar-header h2 { font-size: 1.2rem; }
.sidebar-header span { color: var(--primary); }

.sidebar-nav { flex-grow: 1; padding: 0 1rem; display: flex; flex-direction: column; gap: 0.5rem;}
.nav-item {
  padding: 1rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  transition: 0.2s;
  font-weight: 500;
}
.nav-item:hover, .router-link-active { background-color: #27272a; color: var(--text-main); }
.router-link-active { border-left: 4px solid var(--primary); }

.main-content { margin-left: var(--sidebar-width); flex-grow: 1; display: flex; flex-direction: column; }
.top-header { padding: 1.5rem 2rem; background-color: rgba(9, 9, 11, 0.8); border-bottom: 1px solid #27272a; }
.view-area { padding: 2rem; }

/* Estilos compartidos para las vistas */
.card { background-color: var(--bg-card); border-radius: 12px; padding: 1.5rem; border: 1px solid #27272a; }
.title { color: var(--text-muted); font-size: 1rem; margin-bottom: 0.5rem; }
.value { font-size: 2.5rem; font-weight: bold; }
.unit { font-size: 1.2rem; color: var(--text-muted); }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { color: var(--text-muted); padding-bottom: 1rem; border-bottom: 1px solid #3f3f46; }
td { padding: 1rem 0; border-bottom: 1px solid #27272a; }
</style>