<template>
  <Dropdown
    id="group-dropdown"
    :model-value="GroupLabel"
    :options="GroupLabels"
    class="mt-4 z-1"
    @update:model-value="itemService?.changeGroupLabel"
    :pt="{
      input: {
        class: 'text-xl sm:text-4xl md:text-6xl'
      },
      item: {
        class: 'text-xl sm:text-xl md:text-3xl'
      }
    }"
  />
  <div ref="container" class="flex spin-container">
    <div
      class="spin-button"
      :class="{ disabled: !Items?.length || spinning }"
      @click="spin"
      @keyup.enter="spin"
      @keyup.space="spin"
      tabindex="0"
      role="button"
      aria-label="Spin"
    >
      <img src="/img/spin.png" alt="Spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue';
import { Wheel, type WheelProps } from 'spin-wheel';
import { useDialog } from 'primevue/usedialog';
import { LabelLength } from '@/services/SettingService';
import { GroupLabel, GroupLabels, ItemService, Items } from '@/services/ItemService';
import CongratulationDialog from '@/components/CongratulationDialog.vue';

const itemService = inject<ItemService>('ItemService');

const properties: WheelProps = {
  isInteractive: false,
  radius: 0.48,
  rotationResistance: -400,
  itemLabelRadius: 0.92,
  itemLabelRadiusMax: 0.3,
  itemLabelRotation: 180,
  itemLabelAlign: 'left',
  itemLabelColors: ['#fff'],
  itemLabelBaselineOffset: -0.07,
  itemLabelFont:
    '"Source Serif 4", "Source Sans 3", "Noto Sans TC", "Noto Sans SC", "Noto Sans Lao", "Noto Color Emoji"',
  itemLabelFontSizeMax: 55,
  itemBackgroundColors: [
    '#e74c3c',
    '#3498db',
    '#2ecc71',
    '#f39c12',
    '#9b59b6',
    '#1abc9c',
    '#e67e22',
    '#2980b9',
    '#c0392b',
    '#8e44ad',
    '#d35400'
  ],
  rotationSpeedMax: 2000,
  lineWidth: 1,
  lineColor: '#fff',
  items: []
};

const container = ref();

const visualItems = () => (Items.value || []).map(item => ({ ...item, weight: 1 }));

let spinning = false;
let wheel: Wheel | undefined = undefined;

const stopAndClearSound = () => {
  if (!wheel) return;

  wheel.onCurrentIndexChange = () => {};
  wheel.stop();
};

const weightedPick = (): number | null => {
  const items = Items.value;
  if (!items || items.length === 0) return null;

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= items[i].weight;
    if (random <= 0) return i;
  }
  return items.length - 1;
};

const spin = () => {
  if (!wheel || spinning || !Items.value?.length) return;

  spinning = true;

  const winnerIndex = weightedPick();
  if (winnerIndex === null) return;

  wheel.rotationResistance = -400;
  wheel.spinToItem(winnerIndex, 4000, true, 8, 1);
};

const dialog = useDialog();
const openCongratulationDialog = ($event: {
  type: 'rest';
  currentIndex: number;
  rotation: number;
}) => {
  dialog.open(CongratulationDialog, {
    props: {
      modal: true,
      showHeader: false,
      style: 'border: 0',
      contentStyle: 'border: 0; backgroundColor: transparent',
      dismissableMask: true
    },
    data: {
      item: Items.value![$event.currentIndex]
    }
  });
};

onMounted(() => {
  watch(Items, () => (wheel!.items = visualItems()));
  watch(LabelLength, (newValue) => {
    wheel!.itemLabelRadiusMax = 1 - newValue;
  });

  wheel = new Wheel(container.value, {
    ...properties,
    items: visualItems(),
    itemLabelRadiusMax: 1 - LabelLength.value
  });

  wheel.spin(10);

  wheel.onRest = ($event) => {
    spinning = false;
    stopAndClearSound();
    openCongratulationDialog($event);
  };

  wheel.onSpin = () => {
    gtag('event', 'spin');
  };

  setTimeout(() => {
    wheel!.itemLabelRadiusMax = 1 - LabelLength.value;
  }, 50);
});
</script>

<style lang="scss" scoped>
$sm-breakpoint: 576px;
$md-breakpoint: 768px;

.spin-container {
  aspect-ratio: 1/1;
  width: 200vw;
  height: 90vh;

  margin-top: -3.5rem;
  margin-bottom: -10vh;
  position: relative;
  background: var(--bg-base);
  opacity: 1;

  :deep(canvas) {
    background: var(--bg-base);
  }

  @media (min-width: $sm-breakpoint) {
    height: 100vh;
  }

  @media (min-width: $md-breakpoint) {
    height: 110vh;
  }
}

.spin-button {
  $size: 4rem;
  width: $size;
  height: $size;
  border-radius: 50%;
  position: absolute;
  top: calc(50% - $size / 2);
  left: calc(50% - $size / 2);
  z-index: 2;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  color: #1f2328;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
  }

  &:active {
    transform: scale(0.95);
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
