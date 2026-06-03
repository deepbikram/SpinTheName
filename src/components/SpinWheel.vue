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
  <div ref="container" class="flex spin-container"></div>
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
  // debug: import.meta.env.DEV,
  isInteractive: false,
  radius: 0.48,
  rotationResistance: 0,
  itemLabelRadius: 0.92,
  itemLabelRadiusMax: 0.3,
  itemLabelRotation: 180,
  itemLabelAlign: 'left',
  itemLabelColors: ['#fff'],
  itemLabelBaselineOffset: -0.07,
  // Should also change app.scss
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

let spinCount = 0;
let wheel: Wheel | undefined = undefined;

const stopAndClearSound = () => {
  if (!wheel) return;

  wheel.onCurrentIndexChange = () => {};
  wheel.stop();
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
  watch(Items, (newValue) => (wheel!.items = newValue || []));
  watch(LabelLength, (newValue) => {
    wheel!.itemLabelRadiusMax = 1 - newValue;
  });

  wheel = new Wheel(container.value, {
    ...properties,
    items: Items.value,
    itemLabelRadiusMax: 1 - LabelLength.value
  });

  wheel.spin(10);

  wheel.onRest = ($event) => {
    stopAndClearSound();
    openCongratulationDialog($event);
  };

  wheel.onSpin = () => {
    gtag('event', 'spin');
    gtag('event', 'spin_count', {
      count: ++spinCount
    });
  };

  // Workaround for itemLabelRadiusMax not working on first load.
  setTimeout(() => {
    wheel!.itemLabelRadiusMax = 1 - LabelLength.value;
  }, 50);
});
</script>

<style lang="scss" scoped>
@import 'primeflex/core/_variables.scss';

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

  @media (min-width: map-get($breakpoints, 'sm')) {
    height: 100vh;
  }

  @media (min-width: map-get($breakpoints, 'md')) {
    height: 110vh;
  }
}

.button-container {
  margin-top: -5.5rem;

  button {
    z-index: 2;
    position: relative;

    $background-color: #0c0f1d;
    background: $background-color;

    &:hover {
      filter: brightness(1.3);
    }
  }
}

</style>
