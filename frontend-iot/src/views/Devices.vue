<template>
  <div class="card">
    <table>
      <thead>
        <tr>
          <th>Client ID</th>
          <th>IP Dispositivo</th>
          <th>Última Lectura</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="dispositivos.length === 0">
          <td colspan="3" style="text-align: center; color: #a1a1aa; padding: 2rem;">Cargando dispositivos o sin datos...</td>
        </tr>
        <tr v-else v-for="disp in dispositivos" :key="disp.clientId">
          <td style="font-weight: bold; color: white;">{{ disp.clientId }}</td>
          <td>{{ disp.ip }}</td>
          <td>{{ disp.ultimaConexion }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// 1. Importamos onUnmounted
import { ref, onMounted, onUnmounted } from 'vue'
// IMPORTAMOS LA CONFIGURACIÓN BASE DE LA API
import { API_BASE } from '../apiConfig'

const dispositivos = ref([])
let intervalo // Variable para guardar el temporizador

// 2. Extraemos la lógica del fetch a una función
const cargarDispositivos = async () => {
  try {
    // USAMOS LA VARIABLE DINÁMICA API_BASE
    const res = await fetch(`${API_BASE}/datos`)
    if (res.ok) {
      const payload = await res.json()
      const registros = payload.data || []
      
      const agrupados = {}
      registros.forEach(r => {
        const id = r.clientId || r.ipDispositivo || 'Desconocido'
        agrupados[id] = {
          clientId: r.clientId || 'Sin ID',
          ip: r.ipDispositivo || 'Sin IP',
          ultimaConexion: r.fechaEnvio ? new Date(r.fechaEnvio).toLocaleString() : '--'
        }
      })
      dispositivos.value = Object.values(agrupados)
    }
  } catch (error) { 
    console.error("Error al cargar dispositivos", error) 
  }
}

// 3. Iniciamos la carga y el reloj
onMounted(() => {
  cargarDispositivos() // Carga inmediata al entrar a la vista
  intervalo = setInterval(cargarDispositivos, 2000) // Se actualiza cada 2 segundos
})

// 4. Apagamos el reloj al cambiar de pestaña
onUnmounted(() => {
  clearInterval(intervalo)
})
</script>