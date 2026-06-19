<template>
  <div class="animate-entry">
    <header class="mb-12">
      <nav class="flex gap-1 text-on-surface-variant text-xs uppercase tracking-widest mb-1">
        <router-link to="/" class="hover:text-secondary">Dashboard</router-link>
        <span>/</span>
        <span class="text-secondary font-bold">Reportes</span>
      </nav>
      <h1 class="text-5xl font-semibold text-on-surface tracking-tight">Data Insights & Trends</h1>
      <p class="text-on-surface-variant text-lg mt-2">Análisis profundo de fluctuaciones en la red de nodos.</p>
    </header>

    <div class="grid grid-cols-12 gap-6">
      
      <div class="col-span-12 lg:col-span-6 luminous-card rounded-3xl p-6 relative overflow-hidden h-[450px] chart-container">
        <div class="shader-bg"><div class="shader-circle w-[500px] h-[500px] bg-red-500/5 -top-40 -left-40"></div></div>
        <div class="relative z-10 h-full flex flex-col">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-medium">Historial Temperatura</h3>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Línea de tiempo · °C</p>
            </div>
            <div class="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full">
              <span class="material-symbols-outlined text-[18px]">device_thermostat</span>
              <span class="text-sm">En vivo</span>
            </div>
          </div>
          <div class="flex-grow w-full relative">
            <Line v-if="cargado" :data="tempChartData" :options="chartOptions" />
            <div v-else class="flex h-full items-center justify-center text-gray-400 text-sm">Cargando gráfica...</div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6 luminous-card rounded-3xl p-6 relative overflow-hidden h-[450px] chart-container">
        <div class="shader-bg"><div class="shader-circle w-[500px] h-[500px] bg-blue-500/5 -bottom-40 -right-40"></div></div>
        <div class="relative z-10 h-full flex flex-col">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-medium">Evolución Humedad</h3>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Línea de tiempo · %</p>
            </div>
            <div class="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
              <span class="material-symbols-outlined text-[18px]">water_drop</span>
              <span class="text-sm">En vivo</span>
            </div>
          </div>
          <div class="flex-grow w-full relative">
            <Line v-if="cargado" :data="humChartData" :options="chartOptions" />
            <div v-else class="flex h-full items-center justify-center text-gray-400 text-sm">Cargando gráfica...</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import { API_BASE } from '../apiConfig'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const cargado = ref(false)
const tempChartData = ref({ labels: [], datasets: [] })
const humChartData = ref({ labels: [], datasets: [] })

let intervalo

const chartOptions = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
  interaction: { intersect: false, mode: 'index' },
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#f0f1f2', drawBorder: false }, ticks: { color: '#747878', font: { family: 'Geist' } } },
    x: { grid: { display: false }, ticks: { color: '#747878', font: { family: 'Geist' }, maxTicksLimit: 8 } }
  }
}

const cargarGraficas = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/graficas`)
    if (res.ok) {
      const apiData = await res.json()
      const rawTemps = apiData.temperaturaPorTiempo || []
      const rawHums = apiData.humedadPorTiempo || []

      const etiquetas = rawTemps.map(t => new Date(t.fechaEnvio || t.fecha || t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const dataTemperaturas = rawTemps.map(t => t.temperaturaActual || t.temperatura || t.valor || 0);
      const dataHumedades = rawHums.map(h => h.humedadActual || h.humedad || h.valor || 0);

      tempChartData.value = {
        labels: etiquetas,
        datasets: [{
          label: 'Temperatura', borderColor: '#dc2626', backgroundColor: 'rgba(220, 38, 38, 0.05)',
          data: dataTemperaturas, tension: 0.4, pointRadius: 0, pointHoverRadius: 6, borderWidth: 2, fill: true
        }]
      }

      humChartData.value = {
        labels: etiquetas,
        datasets: [{
          label: 'Humedad', borderColor: '#0042c7', backgroundColor: 'rgba(0, 66, 199, 0.05)',
          data: dataHumedades, tension: 0.4, pointRadius: 0, pointHoverRadius: 6, borderWidth: 2, fill: true
        }]
      }

      cargado.value = true
    }
  } catch (error) { console.error("Error al cargar gráficas", error) }
}

onMounted(() => {
  cargarGraficas()
  intervalo = setInterval(cargarGraficas, 2000)
})

onUnmounted(() => { clearInterval(intervalo) })
</script>

<style scoped>
.luminous-card { background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.04); box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05); transition: transform 0.5s ease, box-shadow 0.5s ease; }
.luminous-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.1); }
.shader-bg { position: absolute; inset: 0; overflow: hidden; z-index: 0; opacity: 0.4; pointer-events: none; }
.shader-circle { position: absolute; border-radius: 50%; filter: blur(60px); animation: drift 20s infinite alternate ease-in-out; }
@keyframes drift { 0% { transform: translate(-10%, -10%) scale(1); } 100% { transform: translate(10%, 10%) scale(1.2); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-entry { opacity: 0; animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
</style>
