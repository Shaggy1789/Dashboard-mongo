<template>
  <div class="history-view">
    
    <div class="filters-card">
      <div class="filter-group">
        <label>Buscar por Dispositivo (Client ID):</label>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="" 
            @input="aplicarFiltroLocal"
          />
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
            <tr v-else-if="historialFiltrado.length === 0">
              <td colspan="4" style="text-align: center; color: #a1a1aa; padding: 2rem;">No se encontraron registros.</td>
            </tr>
            <tr v-else v-for="reg in historialPaginado" :key="reg._id">
              <td style="font-weight: bold; color: white;">
                {{ reg.Id }}<br>
                <small style="color: #71717a; font-weight: normal;">{{ reg.IpServidor }}</small>
              </td>
              <td style="color: #f87171;">{{ Number(reg.Temperatura).toFixed(1) }} °C</td>
              <td style="color: #60a5fa;">{{ Number(reg.Humedad).toFixed(1) }} %</td>
              <td>{{ new Date(reg.Fecha).toLocaleString() }}</td>
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
import { ref, computed, onMounted } from 'vue'
import { API_BASE } from '../apiConfig'

const todosLosRegistros = ref([])
const pagina = ref(1)
const cargando = ref(false)
const busqueda = ref('')

// Obtenemos todos los datos de Mongo en una sola consulta
const cargarTabla = async () => {
  cargando.value = true
  try {
    const res = await fetch(API_BASE)
    if (res.ok) {
      todosLosRegistros.value = await res.json()
      // Si la búsqueda redujo mucho los resultados, evitamos quedarnos en una página vacía
      if (pagina.value > totalPaginas.value) pagina.value = 1
    }
  } catch (error) { 
    console.error("Error al cargar la tabla desde Mongo:", error) 
  } finally {
    cargando.value = false
  }
}

// 1. Filtramos en memoria si el usuario escribe algo
const historialFiltrado = computed(() => {
  if (!busqueda.value.trim()) return todosLosRegistros.value
  
  return todosLosRegistros.value.filter(reg => {
    const id = reg.Id || ''
    return id.toLowerCase().includes(busqueda.value.trim().toLowerCase())
  })
})

// 2. Calculamos el total de páginas basado en los resultados filtrados
const totalPaginas = computed(() => {
  return Math.ceil(historialFiltrado.value.length / 10) || 1
})

// 3. Recortamos el arreglo para mostrar solo los 10 elementos de la página actual
const historialPaginado = computed(() => {
  const inicio = (pagina.value - 1) * 10
  const fin = inicio + 10
  return historialFiltrado.value.slice(inicio, fin)
})

const aplicarFiltroLocal = () => {
  pagina.value = 1 // Regresamos a la primera página al escribir para ver los resultados
}

const limpiarFiltro = () => {
  busqueda.value = ''
  pagina.value = 1
}

onMounted(cargarTabla)
</script>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

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