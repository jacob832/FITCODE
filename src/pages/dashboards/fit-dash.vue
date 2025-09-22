<script setup>
import RevenueGrowth from '@/views/dashboards/fit-code/RevenueGrowth.vue'
import AnalyticsSales from '@/views/dashboards/fit-code/AnalyticsSales.vue'
import ActiveProject from '@/views/dashboards/fit-code/ActiveProject.vue'
import ActivityTimeline from '@/views/dashboards/fit-code/ActivityTimeline.vue'
import ProjectStatus from '@/views/dashboards/fit-code/ProjectStatus.vue'
import EarningReportsYearlyOverview from '@/views/dashboards/fit-code/EarningReportsYearlyOverview.vue'

const kpiCards = [
  { icon: 'tabler-users',   color: 'primary', title: 'Users',     subTitle: 'This Month', stat: '1.2k', change: '+8%' },
  { icon: 'tabler-shopping-cart', color: 'success', title: 'Orders', subTitle: 'This Month', stat: '320', change: '+5%' },
  { icon: 'tabler-currency-dollar', color: 'warning', title: 'Revenue', subTitle: 'This Month', stat: '$12.4k', change: '+12%' },
  { icon: 'tabler-message-dots', color: 'info', title: 'Feedback', subTitle: 'Positive', stat: '85%', change: '+2%' },
]
</script>

<template>
  <VRow class="match-height">
   
    <VCol
      v-for="card in kpiCards"
      :key="card.title"
      cols="12" sm="6" md="3"
    >
      <VCard>
        <VCardText class="text-center">
          <VAvatar :color="card.color" variant="tonal" size="44">
            <VIcon :icon="card.icon" size="28" />
          </VAvatar>
          <h5 class="text-h5 mt-3">{{ card.title }}</h5>
          <p class="my-1">{{ card.subTitle }}</p>
          <p class="mb-2 text-high-emphasis">{{ card.stat }}</p>
          <VChip :color="card.color" size="small" label>{{ card.change }}</VChip>
        </VCardText>
      </VCard>
    </VCol>


    <VCol cols="12" md="8">
      <RevenueGrowth />
    </VCol>
    <VCol cols="12" md="4">
      <AnalyticsSales />
    </VCol>


    <VCol cols="12" md="6">
      <ActiveProject />
    </VCol>
    <VCol cols="12" md="6">
      <ActivityTimeline />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <ProjectStatus />
    </VCol>

  
    <VCol
      cols="12"
      md="8"
    >
      <EarningReportsYearlyOverview />
    </VCol>

    <VCol cols="12" md="6">
      <SalesByCountries />
    </VCol>
  </VRow>
</template>
