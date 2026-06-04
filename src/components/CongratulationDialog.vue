<template>
  <div class="overlay" @click="close">
    <div class="card" @click.stop>
      <button class="x-close" @click="close" aria-label="Close">&times;</button>
      <div class="label">{{ dialogRef?.data.item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, type Ref } from 'vue';
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

let timer: ReturnType<typeof setTimeout>;
onMounted(() => {
  playSound();
  timer = setTimeout(close, 5000);
});

onUnmounted(() => {
  clearTimeout(timer);
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 3rem 2.5rem;
  border-radius: 1.25rem;
  background: var(--panel-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  min-width: 260px;
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.x-close {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.15s;

  &:hover {
    color: var(--text-primary);
  }
}

.label {
  color: var(--text-primary);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
