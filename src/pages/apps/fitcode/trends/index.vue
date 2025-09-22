<script setup>
import { ref, computed, watch } from 'vue'
import ApexCharts from 'vue3-apexcharts'

import { useMetrics } from '@/composables/useMetrics'


const { metrics: trendData, loading, error } = useMetrics('data-2')


const dates = computed(() => {
  if (!trendData.value?.weights) return []
  return Object.keys(trendData.value.weights).sort((a, b) => new Date(a) - new Date(b))
})


const formattedLabels = computed(() =>
  dates.value.map(date => {
    const d = new Date(date)
    // Short format like "May 30"
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
)

const series = computed(() => [
  { name: 'Weight (kg)', data: dates.value.map(date => trendData.value.weights[date]) },
  { name: 'Body Fat (%)', data: dates.value.map(date => trendData.value.fats[date]) }
])


const chartOptions = computed(() => ({
  chart: {
    id: 'trend-chart',
    toolbar: { show: true },
    zoom: { enabled: true }
  },
  xaxis: {
    categories: formattedLabels.value,
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: { fontSize: '12px' },
      trim: true,
      maxHeight: 75
    }
  },
  yaxis: [
    { title: { text: 'Weight (kg)' }, min: 0 },
    { opposite: true, title: { text: 'Body Fat (%)' }, min: 0 }
  ],
  stroke: { curve: 'smooth', width: 3 },
  tooltip: {
    shared: true,
    x: {
      formatter: (val, opts) => dates.value[opts.dataPointIndex] // show full date
    }
  },
  legend: { position: 'top', horizontalAlign: 'center' },
  responsive: [
    {
      breakpoint: 768,
      options: {
        xaxis: { labels: { rotate: -60, style: { fontSize: '10px' } } },
        stroke: { width: 2 }
      }
    }
  ],
  colors: ['#3b82f6', '#f97316'],
  title: { text: 'Weight & Body Fat Trends', align: 'center', style: { fontSize: '16px' },offsetY:20 }
}))
</script>

<template>
  <div class="trend-wrapper">
    <!-- Loading skeleton -->
    <div v-if="loading" class="d-flex justify-center mt-8">
      <VSkeletonLoader type="card" height="350" width="90%" />
    </div>


    <div v-else-if="error" class="text-center text-error mt-4">
      {{ error }}
    </div>


    <ApexCharts
      v-else
      type="line"
      :options="chartOptions"
      :series="series"
      height="350"
      width="100%"
    />
  </div>
</template>

<style scoped>
.trend-wrapper {
  margin-top: 2rem;
  width: 100%;
}
</style>
