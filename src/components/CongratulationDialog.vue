<template>
  <div class="congrats" ref="congrats" @click="close">
    <div ref="label" class="label text-center max-w-screen overflow-x-hidden">
      {{ dialogRef?.data.item.label }}
    </div>
    <div class="subtext">Selected topic</div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue';
import { CongratulationSound } from '@/services/SettingService';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';

const dialogRef = inject<DynamicDialogInstance>('dialogRef') as unknown as
  | Ref<DynamicDialogInstance>
  | undefined;
const congrats = ref();
const label = ref();

const playSound = () => {
  if (!CongratulationSound.value) return;

  var src = CongratulationSound.value.value.startsWith('data:')
    ? CongratulationSound.value.value
    : `/sound/${CongratulationSound.value.value}`;
  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play();
};

const close = () => {
  dialogRef?.value.close();
};

onMounted(() => {
  playSound();
});
</script>

<style scoped lang="scss">
.congrats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
}

.label {
  color: #1f2328;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.subtext {
  color: #6a6f76;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}
</style>
