<script setup>
import { ref } from 'vue'
import { VRow, VCol, VCard, VCardText, VAvatar, VIcon, VChip } from 'vuetify/components'

import { useMetrics } from '@/composables/useMetrics'

const { metrics, loading, error } = useMetrics('data-1')



</script>

<template>
  <div class="report-wrapper">
    <VRow v-if="loading" class="loading-wrapper">
  <VCol cols="12" class="d-flex justify-center">
    <VSkeletonLoader
      type="card"
      height="250"
      width="300"
      class="mx-2"
      v-for="n in 3"
      :key="n"
    />
  </VCol>
</VRow>

    <div v-else-if="error">{{ error }}</div>
  <VRow class="report-metrics">
    <VCol
      v-for="metric in metrics"
      :key="metric.title"
      cols="12" sm="6" md="4" lg="3"
    >
      <VCard class="metric-card" :class="`border-${metric.color}`">
        <VAvatar :color="metric.color" variant="tonal" size="48" class="metric-avatar">
          <VIcon :icon="metric.icon" size="28" />
        </VAvatar>

        <h5 class="metric-title">{{ metric.title }}</h5>
        <p class="metric-unit">{{ metric.unit }}</p>
        <p class="metric-value">{{ metric.currentValue }} {{ metric.unit }}</p>

        <VChip
          :color="metric.color"
          size="small"
          label
          class="metric-chip"
        >
          <template v-if="metric.differenceValue >= 0">
            <VIcon size="16" icon="tabler-arrow-up" class="me-1" />
            +{{ metric.differenceValue }}
          </template>
          <template v-else>
            <VIcon size="16" icon="tabler-arrow-down" class="me-1" />
            {{ metric.differenceValue }}
          </template>
        </VChip>
      </VCard>
    </VCol>
  </VRow>
</div>
</template>
<style lang="scss">
@use "@core/scss/template/pages/report";
</style>

