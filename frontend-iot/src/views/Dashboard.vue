<template>
  <div class="grid">
    <div class="card" style="border-top: 4px solid #a855f7;">
      <p class="title">Último Dispositivo</p>
      <h2 class="value" style="font-size: 1.8rem; word-break: break-all;">
        {{ resumen.ultimoDispositivo }}
      </h2>
    </div>

    <div class="card" style="border-top: 4px solid #ef4444;">
      <p class="title">Temperatura Actual</p>
      <h2 class="value">{{ resumen.temperatura }} <span class="unit">°C</span></h2>
    </div>
    
    <div class="card" style="border-top: 4px solid #3b82f6;">
      <p class="title">Humedad Actual</p>
      <h2 class="value">{{ resumen.humedad }} <span class="unit">%</span></h2>
    </div>
    
    <div class="card" style="border-top: 4px solid #22c55e;">
      <p class="title">Total Registros</p>
      <h2 class="value">{{ resumen.totalRegistros }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// IMPORTAMOS LA CONFIGURACIÓN BASE DE LA API
import { API_BASE } from '../apiConfig'

const resumen = ref({ 
  temperatura: '--', 
  humedad: '--', 
  totalRegistros: 0,
  ultimoDispositivo: '--' 
})

let intervalo // Declaramos la variable para el temporizador

// 1. Extraemos la lógica a una función independiente
const cargarResumen = async () => {
  try {
    // USAMOS LA VARIABLE DINÁMICA API_BASE
    const res = await fetch(`${API_BASE}/dashboard/resumen`)
    if (res.ok) {
      const data = await res.json()
      
      resumen.value = {
        temperatura: Number(data.temperaturaActual || 0).toFixed(2),
        humedad: Number(data.humedadActual || 0).toFixed(2),
        totalRegistros: data.totalRegistrosGuardados || 0,
        ultimoDispositivo: data.ultimoClientId || data.ultimaIpDispositivo || 'Desconocido'
      }
    }
  } catch (error) { 
    console.error("Error cargando resumen", error) 
  }
}

// 2. Iniciamos la carga y el temporizador cuando se abre la vista
onMounted(() => {
  cargarResumen() // Carga el primer dato de inmediato
  intervalo = setInterval(cargarResumen, 2000) // Se repite cada 2000 ms (2 segundos)
})

// 3. Destruimos el temporizador cuando cambias a la pestaña de "Dispositivos" o "Gráficas"
onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
/* El grid auto-fit se encargará de acomodar las 4 tarjetas automáticamente */
.grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
  gap: 1.5rem; 
}
</style>