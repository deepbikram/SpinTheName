<template>
  <div class="overlay" @click="close">
    <div class="card" @click.stop>
      <div class="badge">Selected</div>
      <div class="label">{{ dialogRef?.data.item.label }}</div>
      <div class="divider"></div>
      <button class="close-btn" @click="close">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, type Ref } from 'vue';
import { CongratulationSound } from '@/services/SettingService';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';

const dialogRef = inject<DynamicDialogInstance>('dialogRef') as unknown as
  | Ref<DynamicDialogInstance>
  | undefined;

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
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  cursor: pointer;
}

.card {
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2.5rem 3rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  min-width: 280px;
  animation: pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #6a6f76;
}

.label {
  color: #1f2328;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
}

.divider {
  width: 2rem;
  height: 2px;
  border-radius: 1px;
  background: #d0d5dd;
}

.close-btn {
  background: none;
  border: 1px solid #d0d5dd;
  border-radius: 2rem;
  padding: 0.5rem 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f2328;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: #98a2b3;
  }
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
