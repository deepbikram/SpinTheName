<template>
  <Sidebar
    v-model:visible="VisibleSidebar"
    position="right"
    :pt="{
      root: {
        style: { width: '500px', maxWidth: '100vw' }
      },
      header: {
        class: 'justify-content-between pb-0'
      }
    }"
  >
    <template #header>
      <h2><i class="pi pi-palette"></i> Setup</h2>
    </template>
    <TabView
      :scrollable="true"
      :pt="{
        panelContainer: {
          class: 'p-0'
        }
      }"
    >
      <TabPanel header="📚 Topics">
        <div class="col-12 mt-2">
          <Button
            icon="pi pi-refresh"
            label="Reset All Weights"
            severity="warning"
            outlined
            class="w-full"
            @click="itemService.resetWeights()"
          />
        </div>
        <Divider />
        <div
          v-focustrap="{
            disabled: Items?.length === 0
          }"
        >
          <ItemInputGroup
            :class="['col-12']"
            v-for="item in Items"
            :key="item._id"
            :modelValue="item"
          ></ItemInputGroup>
        </div>
        <div class="p-inputgroup col-12">
          <Button
            ref="addButton"
            class="w-full"
            icon="pi pi-plus"
            severity="success"
            outlined
            aria-label="Add topic"
            @click="addItem"
          />
        </div>
      </TabPanel>
      <TabPanel header="⚙️ Settings">
        <div v-focustrap>
          <div class="col-12">
            <label for="dd-sound" class="block mb-2">Ticking Sound</label>
            <div class="grid">
              <div class="col-12">
                <Dropdown
                  v-model="TickSound"
                  inputId="dd-sound"
                  :options="TickSounds"
                  optionLabel="label"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  class="w-full"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <label for="dd-sound-congrats" class="block mb-2">Completion Sound</label>
            <div class="grid">
              <div class="col-12">
                <Dropdown
                  v-model="CongratulationSound"
                  inputId="dd-sound-congrats"
                  :options="CongratulationSounds"
                  optionLabel="label"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  class="w-full"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <label for="sl-labelLength" class="block mb-2">Label Density</label>
            <Slider
              v-model="LabelLength"
              inputId="sl-labelLength"
              :min="0.3"
              :max="0.75"
              :step="0.01"
            />
          </div>
          <div class="col-12">
            <label for="sl-fairmode" class="block mb-2">Balanced Mode</label>
            <ToggleButton
              v-model="Fairmode"
              inputId="sl-fairmode"
              @change="
                () => {
                  itemService.syncItems();
                }
              "
              :pt="{
                root: {
                  class: 'w-full'
                }
              }"
            />
          </div>
          <div class="col-12 mt-3">
            <label for="sl-darkmode" class="block mb-2">Dark Mode</label>
            <ToggleButton
              v-model="DarkMode"
              inputId="sl-darkmode"
              :pt="{
                root: {
                  class: 'w-full'
                }
              }"
            />
          </div>
          <div class="col-12 mt-4">
            <h3 class="text-900 mb-2">Appearance</h3>
            <label class="block mb-2">Color Palette (comma separated)</label>
            <Textarea v-model="paletteText" rows="2" />
            <div class="p-inputgroup mt-2">
              <Button class="w-full" label="Apply Palette" icon="pi pi-check" @click="applyPalette" />
            </div>

            <label class="block mt-3 mb-2">Label Font</label>
            <InputText v-model="ItemLabelFont" />

            <label class="block mt-3 mb-2">Max Label Font Size</label>
            <Slider v-model="ItemLabelFontSizeMax" :min="12" :max="120" />

            <label class="block mt-3 mb-2">Spin Speed (max)</label>
            <Slider v-model="RotationSpeedMax" :min="200" :max="6000" step="50" />

            <label class="block mt-3 mb-2">Rotation Resistance (friction)</label>
            <Slider v-model="RotationResistance" :min="0" :max="1" step="0.01" />
          </div>
        </div>
      </TabPanel>
    </TabView>
  </Sidebar>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { ItemService, Items } from '@/services/ItemService';
import { SidebarService, VisibleSidebar } from '@/services/SidebarService';
import {
  TickSound,
  TickSounds,
  CongratulationSound,
  CongratulationSounds,
  LabelLength,
  Fairmode,
  DarkMode,
  ItemBackgroundColors,
  ItemLabelFont,
  ItemLabelFontSizeMax,
  RotationSpeedMax,
  RotationResistance
} from '@/services/SettingService';

const itemService = inject<ItemService>('ItemService') as ItemService;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sidebarService = inject<SidebarService>('SidebarService');

const addItem = () => {
  itemService.addItem();
  setTimeout(() => {
    const list = document.querySelector('.p-tabview-panels');
    if (list) {
      list.scrollTo({
        top: list.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, 100);
};

const paletteText = ref<string>(ItemBackgroundColors.value.join(', '));
const applyPalette = () => {
  ItemBackgroundColors.value = paletteText.value
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c);
};

watch(ItemBackgroundColors, (newValue) => {
  paletteText.value = newValue.join(', ');
});
</script>

<style lang="scss" scoped>
:deep(.p-tabview-panels) {
  padding: 0 1rem !important;
}

:deep(.p-sidebar-header) {
  padding: 1.25rem 1rem 0 1rem !important;
}
</style>
