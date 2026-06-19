<template>
  <div class="history-view">
    
    <div class="filters-card">
      <div class="filter-group">
        <label>Buscar por Dispositivo (Client ID):</label>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Ej. ESP32-DxRx" 
            @keyup.enter="aplicarFiltro"
          />
          <button @click="aplicarFiltro" class="btn-search">Buscar</button>
          <button @click="limpiarFiltro" class="btn-clear" v-if="busqueda">Limpiar</button>
          
          <button @click="cargarTabla" class="btn-refresh" :disabled="cargando">
            {{ cargando ? '...' : '🔄' }}
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Dispositivo</th>
              <th>Temp.</th>
              <th>Hum.</th>
              <th>Fecha Envío</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="4" style="text-align: center; color: #a1a1aa; padding: 2rem;">Cargando registros...</td>
            </tr>
            <tr v-else-if="historial.length === 0">
              <td colspan="4" style="text-align: center; color: #a1a1aa; padding: 2rem;">No se encontraron registros.</td>
            </tr>
            <tr v-else v-for="reg in historial" :key="reg.id">
              <td style="font-weight: bold; color: white;">
                {{ reg.clientId }}<br>
                <small style="color: #71717a; font-weight: normal;">{{ reg.ipDispositivo }}</small>
              </td>
              <td style="color: #f87171;">{{ Number(reg.temperatura).toFixed(1) }} °C</td>
              <td style="color: #60a5fa;">{{ Number(reg.humedad).toFixed(1) }} %</td>
              <td>{{ new Date(reg.fechaEnvio).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button @click="pagina--" :disabled="pagina === 1 || cargando">◀ Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button @click="pagina++" :disabled="pagina >= totalPaginas || cargando">Siguiente ▶</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// IMPORTAMOS LA CONFIGURACIÓN BASE DE LA API
import { API_BASE } from '../apiConfig'

const historial = ref([])
const pagina = ref(1)
const totalPaginas = ref(1)
const cargando = ref(false)

// Estado para el buscador
const busqueda = ref('')

const cargarTabla = async () => {
  cargando.value = true
  try {
    // USAMOS LA VARIABLE DINÁMICA API_BASE PARA LA PAGINACIÓN
    let url = `${API_BASE}/datos/filtrar?page=${pagina.value}&pageSize=10`
    
    // Si el usuario escribió algo en el buscador, lo añadimos a la URL
    if (busqueda.value.trim() !== '') {
      url += `&clientId=${busqueda.value.trim()}`
    }

    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      historial.value = data.data || []
      // Calculamos el total de páginas
      totalPaginas.value = Math.ceil((data.total || 0) / 10) || 1
    } else {
      historial.value = []
    }
  } catch (error) { 
    console.error("Error al cargar la tabla:", error) 
  } finally {
    cargando.value = false
  }
}

// Botones del buscador
const aplicarFiltro = () => {
  pagina.value = 1 // Regresar a la página 1 al buscar algo nuevo
  cargarTabla()
}

const limpiarFiltro = () => {
  busqueda.value = ''
  pagina.value = 1
  cargarTabla()
}

// Carga inicial
onMounted(cargarTabla)

// Si la página cambia (al darle clic a Anterior/Siguiente), vuelve a consultar la API
watch(pagina, cargarTabla) 
</script>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Estilos del buscador */
.filters-card {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #27272a;
}

.filter-group label {
  display: block;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
}

.search-bar input {
  flex-grow: 1;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #3f3f46;
  background-color: #27272a;
  color: white;
  outline: none;
}

.search-bar input:focus {
  border-color: var(--primary);
}

.btn-search {
  background-color: var(--primary);
  color: #000;
  border: none;
  padding: 0 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-clear {
  background-color: transparent;
  color: #f87171;
  border: 1px solid #f87171;
  padding: 0 1rem;
  border-radius: 6px;
  cursor: pointer;
}

/* ESTILO DEL BOTÓN DE ACTUALIZAR */
.btn-refresh {
  background-color: #27272a;
  color: white;
  border: 1px solid #3f3f46;
  padding: 0 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-refresh:hover:not(:disabled) { background-color: #3f3f46; }
.btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

/* Paginación */
.pagination { 
  display: flex; 
  justify-content: space-between; 
  margin-top: 1.5rem; 
  align-items: center; 
}

.pagination button { 
  background: #27272a; 
  color: white; 
  border: none; 
  padding: 0.5rem 1rem; 
  border-radius: 6px; 
  cursor: pointer; 
  transition: 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #3f3f46;
}

.pagination button:disabled { 
  opacity: 0.4; 
  cursor: not-allowed; 
}
</style>