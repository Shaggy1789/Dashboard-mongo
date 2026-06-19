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

// 2. Extraemos la lógica del fetch a una función adaptada a MongoDB
const cargarDispositivos = async () => {
  try {
    // LLAMAMOS AL ENDPOINT BASE DE MONGO SIN RUTA ADICIONAL
    const res = await fetch(API_BASE)
    if (res.ok) {
      const registros = await res.json() // Recibe el arreglo plano
      
      const agrupados = {}
      registros.forEach(r => {
        // Usamos las propiedades exactas de tu colección en Mongo (Id, IpServidor)
        const id = r.Id || r.IpServidor || 'Desconocido'
        
        // Como Mongo ya ordena del más nuevo al más viejo, solo guardamos el primero que veamos por cada ID
        if (!agrupados[id]) {
          agrupados[id] = {
            clientId: r.Id || 'Sin ID',
            ip: r.IpServidor || 'Sin IP',
            ultimaConexion: r.Fecha ? new Date(r.Fecha).toLocaleString() : '--'
          }
        }
      })
      dispositivos.value = Object.values(agrupados)
    }
  } catch (error) { 
    console.error("Error al cargar dispositivos desde MongoDB", error) 
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