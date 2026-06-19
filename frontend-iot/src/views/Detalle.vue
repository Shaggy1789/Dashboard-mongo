<template>
  <div class="animate-entrance">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div class="flex flex-col gap-2">
        <nav class="flex items-center gap-1 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 w-fit">
          <button @click="$router.push('/')" class="p-1 -ml-1 rounded-full hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant text-base">arrow_back</span>
          </button>
          <router-link to="/" class="text-on-surface-variant text-sm hover:text-secondary transition-colors">Dashboard</router-link>
          <span class="text-on-surface-variant text-sm">/</span>
          <span class="text-on-surface text-sm font-semibold">{{ clientId }}</span>
        </nav>
        
        <div class="flex items-center gap-6 mt-2">
          <div class="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-secondary border border-secondary/10 shadow-sm">
            <span class="material-symbols-outlined text-3xl">developer_board</span>
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-on-surface">{{ clientId }}</h1>
              <div class="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-green-50 text-green-700 text-xs border border-green-100 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></span>
                Monitoreando
              </div>
            </div>
            <div class="flex items-center gap-4 mt-1">
              <span v-if="ultimoRegistro" class="font-mono text-xs text-on-surface-variant bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                IP: {{ ultimoRegistro.ipDispositivo }}
              </span>
              <div class="flex items-center gap-1 text-on-surface-variant text-xs">
                <span class="material-symbols-outlined text-sm">database</span>
                Registros encontrados en esta página: <span class="font-semibold text-on-surface">{{ historial.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-4 grid grid-cols-1 gap-6">
        <div class="luminous-card rounded-3xl p-6 relative overflow-hidden h-[160px] flex flex-col justify-between">
          <div class="shader-container opacity-10">
            <canvas id="detalle-temp-shader" class="w-full h-full"></canvas>
          </div>
          <div class="relative z-10">
            <span class="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Temperatura Actual</span>
            <div class="flex items-end justify-between mt-3">
              <span class="text-[48px] font-bold text-on-surface leading-none">
                {{ ultimoRegistro ? Number(ultimoRegistro.temperatura).toFixed(1) : '--' }}<span class="text-2xl font-normal text-on-surface-variant">°C</span>
              </span>
              <div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm">
                <span class="material-symbols-outlined text-orange-600">device_thermostat</span>
              </div>
            </div>
          </div>
        </div>

        <div class="luminous-card rounded-3xl p-6 relative overflow-hidden h-[160px] flex flex-col justify-between">
          <div class="shader-container opacity-10">
            <canvas id="detalle-hum-shader" class="w-full h-full"></canvas>
          </div>
          <div class="relative z-10">
            <span class="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Humedad Actual</span>
            <div class="flex items-end justify-between mt-3">
              <span class="text-[48px] font-bold text-on-surface leading-none">
                {{ ultimoRegistro ? Number(ultimoRegistro.humedad).toFixed(0) : '--' }}<span class="text-2xl font-normal text-on-surface-variant">%</span>
              </span>
              <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                <span class="material-symbols-outlined text-blue-600">humidity_mid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-8 luminous-card rounded-3xl p-6 relative overflow-hidden min-h-[340px]">
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 class="text-2xl font-medium text-on-surface">Fluctuación Ambiental</h3>
            <p class="text-sm text-on-surface-variant mt-1">Monitoreo reciente</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-secondary"></span><span class="text-sm text-on-surface-variant font-medium">Temp</span></div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span><span class="text-sm text-on-surface-variant font-medium">Hum</span></div>
          </div>
        </div>
        <div class="h-64 w-full flex items-end justify-between gap-4 px-4 relative z-10">
          <div class="absolute inset-x-0 bottom-0 top-16 flex flex-col justify-between opacity-10 pointer-events-none">
            <div class="w-full h-[1px] bg-outline-variant"></div><div class="w-full h-[1px] bg-outline-variant"></div><div class="w-full h-[1px] bg-outline-variant"></div><div class="w-full h-[1px] bg-outline-variant"></div>
          </div>
          <div v-for="i in 7" :key="i" class="flex-1 flex flex-col justify-end gap-1.5 h-full">
            <div class="w-full bg-secondary/10 rounded-t-sm transition-all duration-700 hover:bg-secondary/20" :style="`height: ${50 + Math.random() * 20}%`"></div>
            <div class="w-full bg-tertiary/10 rounded-t-sm transition-all duration-700 hover:bg-tertiary/20" :style="`height: ${40 + Math.random() * 15}%`"></div>
          </div>
        </div>
      </div>

      <div class="md:col-span-12 mt-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex flex-col">
            <h3 class="text-2xl font-medium text-on-surface">Historial de Registros</h3>
            <p class="text-sm text-on-surface-variant">Listado completo de lecturas del dispositivo</p>
          </div>
        </div>
        <div class="luminous-card rounded-3xl overflow-hidden border border-outline-variant/20">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Humedad</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Temperatura</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de Red</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="cargando">
                  <td colspan="4" class="text-center py-8 text-gray-500">Cargando registros...</td>
                </tr>
                <tr v-else-if="historial.length === 0">
                  <td colspan="4" class="text-center py-8 text-gray-500">No hay registros para este dispositivo.</td>
                </tr>
                <tr v-for="reg in historial" :key="reg.id" class="hover-row hover:bg-blue-50/30 transition-colors">
                  <td class="px-6 py-5 font-mono text-sm text-on-surface">{{ new Date(reg.fechaEnvio).toLocaleString() }}</td>
                  <td class="px-6 py-5 text-sm text-on-surface">{{ Number(reg.humedad).toFixed(1) }}%</td>
                  <td class="px-6 py-5 text-sm text-on-surface font-semibold">{{ Number(reg.temperatura).toFixed(1) }}°C</td>
                  <td class="px-6 py-5">
                    <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">Registrado</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div class="flex items-center gap-6"><span class="text-sm text-gray-500">Página <span class="font-semibold text-gray-900">{{ pagina }}</span> de {{ totalPaginas }}</span></div>
            <div class="flex items-center gap-2">
              <button @click="pagina--" :disabled="pagina === 1 || cargando" class="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all text-gray-600 disabled:opacity-30"><span class="material-symbols-outlined">chevron_left</span></button>
              <button @click="pagina++" :disabled="pagina >= totalPaginas || cargando" class="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all text-gray-600 disabled:opacity-30"><span class="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '../apiConfig'

const route = useRoute()
const clientId = ref(route.params.id || 'Desconocido')

const historial = ref([])
const pagina = ref(1)
const totalPaginas = ref(1)
const cargando = ref(false)

const ultimoRegistro = computed(() => {
  return historial.value.length > 0 ? historial.value[0] : null
})

const cargarTabla = async () => {
  cargando.value = true
  try {
    let url = `${API_BASE}/datos/filtrar?page=${pagina.value}&pageSize=10&clientId=${clientId.value}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      historial.value = data.data || []
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

// Inicialización de los shaders igual que en el dashboard
const initShader = (canvasId, fragmentShaderSource) => {
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, `attribute vec2 a_position; varying vec2 v_texCoord; void main() { v_texCoord = a_position * 0.5 + 0.5; v_texCoord.y = 1.0 - v_texCoord.y; gl_Position = vec4(a_position, 0, 1);}`);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    function render(time) {
        canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, time * 0.001); gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6); requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

onMounted(async () => {
  cargarTabla()
  await nextTick();
  initShader('detalle-temp-shader', `precision highp float; varying vec2 v_texCoord; uniform float u_time; void main() { vec2 uv = v_texCoord; float ripple = sin(uv.y * 15.0 - u_time * 3.0) * 0.03; vec3 finalColor = mix(vec3(0.95, 0.2, 0.1), vec3(1.0, 0.8, 0.2), uv.y) + (sin(u_time * 2.0) * 0.5 + 0.5) * 0.1; gl_FragColor = vec4(finalColor, 1.0); }`);
  initShader('detalle-hum-shader', `precision highp float; varying vec2 v_texCoord; uniform float u_time; void main() { vec2 uv = v_texCoord; float totalWave = sin(uv.x * 3.0 + u_time * 0.5) * 0.15 + cos(uv.x * 6.0 - u_time * 0.8) * 0.05 + 0.5; float mask = smoothstep(totalWave - 0.01, totalWave + 0.01, uv.y); vec3 colorB = vec3(0.0, 0.48, 1.0); gl_FragColor = vec4(mix(colorB, vec3(1.0), mask), 1.0); }`);
})

watch(pagina, cargarTabla) 
</script>

<style scoped>
.luminous-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.04); transition: transform 0.4s ease, box-shadow 0.4s ease; }
.luminous-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.08); }
.shader-container { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.08; }
.pulse-dot { animation: softPulse 2s infinite ease-in-out; }
@keyframes softPulse { 0%, 100% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-entrance { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
</style>
