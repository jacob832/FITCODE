import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

export function useMetrics(endpoint = '') {
  const metrics = ref([])
  const loading = ref(true)
  const error = ref(null)

  const fetchMetrics = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await useApi(`/${endpoint}`).json()
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to fetch')
      }


      await new Promise(resolve => setTimeout(resolve, 60000))

      metrics.value = data.value?.data || [] 
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchMetrics)

  return { metrics, loading, error, fetchMetrics }
}
