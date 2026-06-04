<template>
  <div class="spin-root">
    <Dropdown
      id="group-dropdown"
      :model-value="GroupLabel"
      :options="GroupLabels"
      class="z-1"
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
    <div ref="container" class="spin-container">
    <div class="arrow"></div>
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
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
import { Wheel, type WheelProps } from 'spin-wheel';
import { useDialog } from 'primevue/usedialog';
import {
  LabelLength,
  ItemBackgroundColors,
  ItemLabelFont,
  ItemLabelFontSizeMax,
  RotationSpeedMax,
  RotationResistance,
  TickSound,
  CongratulationSound
} from '@/services/SettingService';
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
    ItemLabelFont.value,
  itemLabelFontSizeMax: ItemLabelFontSizeMax.value,
  itemBackgroundColors: ItemBackgroundColors.value,
  rotationSpeedMax: RotationSpeedMax.value,
  lineWidth: 1,
  lineColor: '#fff',
  items: []
};

const container = ref();

const visualItems = () => (Items.value || []).map(item => ({ ...item, weight: 1 }));

let spinning = false;
let wheel: Wheel | undefined = undefined;
let spinCount = 0;
let tickAudio: HTMLAudioElement | undefined = undefined;
let congratsAudio: HTMLAudioElement | undefined = undefined;

const idleSlowSpin = () => {
  if (!wheel) return;
  wheel.rotationResistance = 0;
  wheel.spin(6);
};

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
  wheel.stop();

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
      style: 'border: 0; background: transparent; box-shadow: none',
      contentStyle: 'border: 0; background: transparent',
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
  watch(ItemBackgroundColors, (newValue) => {
    wheel!.itemBackgroundColors = newValue;
  });
  watch(ItemLabelFont, (newValue) => {
    wheel!.itemLabelFont = newValue;
  });
  watch(ItemLabelFontSizeMax, (newValue) => {
    wheel!.itemLabelFontSizeMax = newValue;
  });
  watch(RotationSpeedMax, (newValue) => {
    wheel!.rotationSpeedMax = newValue;
  });
  watch(RotationResistance, (newValue) => {
    wheel!.rotationResistance = newValue;
  });

  wheel = new Wheel(container.value, {
    ...properties,
    items: visualItems(),
    itemLabelRadiusMax: 1 - LabelLength.value
  });

  wheel.onRest = ($event) => {
    spinning = false;
    stopAndClearSound();
    openCongratulationDialog($event);
    if (CongratulationSound.value) {
      try {
        congratsAudio = new Audio(
          CongratulationSound.value.value.startsWith('data:')
            ? CongratulationSound.value.value
            : `/sound/${CongratulationSound.value.value}`
        );
        congratsAudio.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    }
    setTimeout(() => idleSlowSpin(), 100);
  };

  idleSlowSpin();

  wheel.onSpin = () => {
    gtag('event', 'spin');
    gtag('event', 'spin_count', {
      count: ++spinCount
    });
    if (TickSound.value) {
      try {
        tickAudio = new Audio(
          TickSound.value.value.startsWith('data:') ? TickSound.value.value : `/sound/${TickSound.value.value}`
        );
        tickAudio.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  };

  setTimeout(() => {
    wheel!.itemLabelRadiusMax = 1 - LabelLength.value;
  }, 50);

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !spinning && Items.value?.length && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
      e.preventDefault();
      spin();
    }
  };
  document.addEventListener('keydown', onKey);
  onUnmounted(() => document.removeEventListener('keydown', onKey));
});
</script>

<style lang="scss" scoped>
$sm-breakpoint: 576px;
$md-breakpoint: 768px;

.spin-root {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 0;
}

.spin-container {
  width: min(200vw, 200vh);
  height: min(200vw, 200vh);
  position: relative;
  background: var(--bg-base);

  :deep(canvas) {
    background: var(--bg-base);
  }
}

.arrow {
  position: absolute;
  top: calc(50% - 3rem);
  left: calc(50% - 0.5rem);
  z-index: 3;
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-bottom: 1rem solid #1f2328;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
