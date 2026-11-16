import { ref } from 'vue'

// App-wide class shift ('day' | 'night'). Set from the side nav; only the
// attendance tracker reads it.
const shift = ref('night')

export function useShift() {
  return { shift }
}
