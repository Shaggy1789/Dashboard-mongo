<template>
  <div>
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
      <div class="lg:col-span-8 glass-card rounded-3xl p-12 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
        <div class="shader-container opacity-10">
          <canvas class="w-full h-full" id="temp-shader-canvas"></canvas>
        </div>
        <div class="flex justify-between items-start z-10 relative">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Temperatura Global</span>
              <div class="px-2 py-0.5 rounded-full bg-secondary/10 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-secondary rounded-full status-pulse"></span>
                <span class="text-[10px] font-bold text-secondary uppercase tracking-tighter">Live</span>
              </div>
            </div>
            <h2 class="text-[48px] text-on-surface font-bold leading-tight">{{ resumen.temperatura }}<span class="text-3xl font-medium text-on-surface-variant/50 ml-1">°C</span></h2>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 glass-card rounded-3xl p-12 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
        <div class="z-10 relative">
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Humedad Media</p>
          <div class="flex items-baseline gap-1">
            <h2 class="text-3xl text-on-surface font-bold">{{ resumen.humedad }}<span class="text-2xl font-medium text-on-surface-variant/50">%</span></h2>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center py-6 z-10 relative">
          <div class="relative w-40 h-40">
            <div class="absolute inset-0 rounded-full overflow-hidden scale-90 opacity-20">
              <canvas class="w-full h-full" id="hum-shader-canvas"></canvas>
            </div>
            <svg class="w-full h-full -rotate-90 relative">
              <circle class="text-[#e7e8e9]" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" stroke-width="10"></circle>
              <circle class="text-secondary transition-all duration-1000" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" :stroke-dasharray="465" :stroke-dashoffset="465 - (465 * resumen.humedad) / 100" stroke-linecap="round" stroke-width="10"></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-secondary text-[32px]">humidity_mid</span>
              <span class="text-sm font-bold text-on-surface-variant mt-1">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
      <div class="flex flex-wrap gap-4 w-full xl:w-auto">
        <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-4 premium-shadow flex items-center gap-4 border border-outline-variant/30">
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <span class="material-symbols-outlined">sensors</span>
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface-variant uppercase">Dispositivos</p>
            <p class="text-2xl font-bold text-on-surface">{{ dispositivos.length }}</p>
          </div>
        </div>
        <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-4 premium-shadow flex items-center gap-4 border border-outline-variant/30">
          <div class="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
            <span class="material-symbols-outlined">database</span>
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface-variant uppercase">Total Registros</p>
            <p class="text-2xl font-bold text-on-surface">{{ resumen.totalRegistros.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h3 class="text-3xl font-bold text-on-surface">Monitoreo por Dispositivo</h3>
          <p class="text-sm text-on-surface-variant/70 mt-1">Gestión y estado de sensores en tiempo real</p>
        </div>
      </div>

      <div class="masonry-grid">
        <article v-for="disp in dispositivos" :key="disp.clientId" class="user-card rounded-3xl overflow-hidden flex flex-col bg-white border border-[#e1e3e4]">
          <div class="p-6 border-b border-outline-variant/10">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#dce1ff] text-[#003ab2] flex items-center justify-center font-bold text-lg">
                  {{ disp.clientId.substring(0,2).toUpperCase() }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-on-surface leading-tight">{{ disp.clientId }}</h4>
                  <p class="font-mono text-sm text-on-surface-variant/60">{{ disp.ip }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                <span class="w-2 h-2 bg-green-500 rounded-full status-pulse"></span>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Live</span>
              </div>
            </div>
            <div class="text-xs text-on-surface-variant">Última lectura: {{ disp.ultimaConexion }}</div>
          </div>
          <div class="bg-gradient-soft p-6 grid grid-cols-2 gap-4">
             <div class="text-center text-sm text-on-surface-variant">Sistema Activo</div>
          </div>
          <div class="p-4 px-6 mt-auto">
            <button @click="$router.push(`/detalle/${disp.clientId}`)" class="w-full py-3 rounded-2xl bg-white border border-outline-variant/40 text-on-surface font-bold text-sm hover:bg-[#f3f4f5] hover:border-secondary transition-all active:scale-[0.98]">
              Ver más detalles
            </button>
          </div>
        </article>
      </div>
      
      <div v-if="dispositivos.length === 0" class="text-center py-12 text-on-surface-variant">
        Buscando dispositivos activos...
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { API_BASE } from '../apiConfig'

const resumen = ref({ temperatura: '--', humedad: '--', totalRegistros: 0, ultimoDispositivo: '--' })
const dispositivos = ref([])
let intervalo

const cargarResumen = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/resumen`)
    if (res.ok) {
      const data = await res.json()
      resumen.value = {
        temperatura: Number(data.temperaturaActual || 0).toFixed(1),
        humedad: Number(data.humedadActual || 0).toFixed(0),
        totalRegistros: data.totalRegistrosGuardados || 0,
        ultimoDispositivo: data.ultimoClientId || data.ultimaIpDispositivo || 'Desconocido'
      }
    }
  } catch (error) { console.error("Error cargando resumen", error) }
}

const cargarDispositivos = async () => {
  try {
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
  } catch (error) { console.error("Error al cargar dispositivos", error) }
}

// Lógica de WebGL (Shaders)
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
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

onMounted(async () => {
  cargarResumen()
  cargarDispositivos()
  intervalo = setInterval(() => { cargarResumen(); cargarDispositivos(); }, 2000)

  // Esperamos a que los canvas existan en el DOM
  await nextTick();
  initShader('temp-shader-canvas', `precision highp float; varying vec2 v_texCoord; uniform float u_time; void main() { vec2 uv = v_texCoord; float ripple = sin(uv.y * 15.0 - u_time * 3.0) * 0.03; float center = 0.5 + ripple; vec3 hotColor = vec3(0.95, 0.2, 0.1); vec3 coolColor = vec3(1.0, 0.8, 0.2); vec3 finalColor = mix(hotColor, coolColor, uv.y) + (sin(u_time * 2.0) * 0.5 + 0.5) * 0.1; gl_FragColor = vec4(finalColor, 1.0); }`);
  initShader('hum-shader-canvas', `precision highp float; varying vec2 v_texCoord; uniform float u_time; float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); } float noise(vec2 st) { vec2 i = floor(st); vec2 f = fract(st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; } void main() { vec2 uv = v_texCoord; float totalWave = sin(uv.x * 3.0 + u_time * 0.5) * 0.15 + cos(uv.x * 6.0 - u_time * 0.8) * 0.05 + 0.5; float mask = smoothstep(totalWave - 0.01, totalWave + 0.01, uv.y); vec3 colorB = vec3(0.0, 0.48, 1.0); vec3 finalColor = mix(mix(colorB, colorB * 1.1, noise(uv * 10.0 + u_time * 0.2)), vec3(1.0), mask); gl_FragColor = vec4(finalColor, 1.0); }`);
})

onUnmounted(() => { clearInterval(intervalo) })
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.04);
}
.premium-shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02); }
.status-pulse { position: relative; }
.status-pulse::after {
  content: ''; position: absolute; width: 100%; height: 100%; top: 0; left: 0;
  background: inherit; border-radius: 50%; animation: status-glow 2s ease-out infinite; opacity: 0.6;
}
@keyframes status-glow { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
.masonry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
.bg-gradient-soft { background: linear-gradient(135deg, #ffffff 0%, #f3f4f5 100%); }
.shader-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.user-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.user-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06); border-color: #0056fd40; }
</style>
