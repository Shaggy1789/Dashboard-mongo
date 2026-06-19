<template>
  <div class="charts-container">
    
    <div class="card chart-card">
      <div class="chart-header">
        <div class="icon-circle red">🌡️</div>
        <h3>Historial de Temperatura</h3>
      </div>
      <div class="canvas-wrapper">
        <Line v-if="cargado" :data="tempChartData" :options="tempChartOptions" />
        <p v-else class="loading-text">Cargando datos...</p>
      </div>
    </div>

    <div class="card chart-card">
      <div class="chart-header">
        <div class="icon-circle blue">💧</div>
        <h3>Historial de Humedad</h3>
      </div>
      <div class="canvas-wrapper">
        <Line v-if="cargado" :data="humChartData" :options="humChartOptions" />
        <p v-else class="loading-text">Cargando datos...</p>
      </div>
    </div>

  </div>
</template>

<script setup>
// 1. Importamos onUnmounted
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
// IMPORTAMOS LA CONFIGURACIÓN BASE DE LA API
import { API_BASE } from '../apiConfig'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const cargado = ref(false)
const tempChartData = ref({ labels: [], datasets: [] })
const humChartData = ref({ labels: [], datasets: [] })

let intervalo // 2. Variable para guardar el temporizador

// --- CONFIGURACIÓN ESTÉTICA COMPARTIDA ---
const crearOpcionesBase = (unidad) => ({
  responsive: true,
  maintainAspectRatio: false,
  color: '#ffffff',
  animation: {
    duration: 400 // Animación más corta para que se vea fluida al actualizar cada 2s
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#ffffff',
      bodyColor: '#a1a1aa',
      borderColor: '#27272a',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context) => ` ${context.parsed.y} ${unidad}`
      }
    }
  },
  scales: {
    y: {
      grid: { color: '#27272a' },
      ticks: { color: '#71717a', font: { size: 11 } },
      beginAtZero: false,
      grace: '20%' 
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#71717a',
        font: { size: 11 },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8 
      }
    }
  }
})

const tempChartOptions = crearOpcionesBase('°C')
const humChartOptions = crearOpcionesBase('%')

// 3. Extraemos la lógica a una función independiente
const cargarGraficas = async () => {
  try {
    // USAMOS LA VARIABLE DINÁMICA API_BASE DIRECTAMENTE A MONGO
    const res = await fetch(API_BASE)
    if (res.ok) {
      const apiData = await res.json()

      // Mongo envía el más reciente primero, usamos reverse para la gráfica
      const datosCronologicos = [...apiData].reverse()

      const etiquetas = datosCronologicos.map(t => {
        // Usamos "Fecha" con mayúscula, que es como viene en tu BD Mongo
        const fecha = new Date(t.Fecha);
        return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });

      // Usamos "Temperatura" y "Humedad" con mayúsculas
      const dataTemperaturas = datosCronologicos.map(t => t.Temperatura || 0);
      const dataHumedades = datosCronologicos.map(h => h.Humedad || 0);

      tempChartData.value = {
        labels: etiquetas,
        datasets: [{
          label: 'Temperatura',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          data: dataTemperaturas,
          tension: 0.4,
          pointRadius: 0, 
          pointHoverRadius: 6,
          pointBackgroundColor: '#ef4444',
          borderWidth: 2,
          fill: true
        }]
      }

      humChartData.value = {
        labels: etiquetas,
        datasets: [{
          label: 'Humedad',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          data: dataHumedades,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
          borderWidth: 2,
          fill: true
        }]
      }

      cargado.value = true
    }
  } catch (error) {
    console.error("Error al cargar gráficas detalladas", error)
  }
}

// 4. Iniciamos la carga y el reloj
onMounted(() => {
  cargarGraficas() // Carga inicial
  intervalo = setInterval(cargarGraficas, 2000) // Se actualiza cada 2 segundos
})

// 5. Apagamos el reloj al cambiar de pestaña
onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.charts-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
}

@media (min-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-card {
  display: flex;
  flex-direction: column;
  height: 400px;
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #27272a;
  padding-bottom: 1rem;
}

.chart-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f4f4f5;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-circle.red { background-color: rgba(239, 68, 68, 0.1); }
.icon-circle.blue { background-color: rgba(59, 130, 246, 0.1); }

.canvas-wrapper {
  flex-grow: 1;
  position: relative;
  width: 100%;
}

.loading-text {
  text-align: center;
  color: #71717a;
  margin-top: 15%;
  font-size: 0.9rem;
}
</style>