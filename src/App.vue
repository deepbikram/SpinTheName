<template>
  <Toast position="bottom-left" />
  <ConfirmPopup id="confirm" aria-label="popup">
    <template #message="slotProps">
      <div class="flex flex-column align-items-center w-full gap-3 p-3">
        <i class="text-6xl" :class="slotProps.message.icon"></i>
        <span>{{ slotProps.message.message }}</span>
      </div>
    </template>
  </ConfirmPopup>
  <div class="layout">
    <div class="header text-center">
      <h1 class="mb-0 text-4xl sm:text-5xl md:text-6xl">
        <span class="white-space-nowrap">Spin The Name</span>
      </h1>
    </div>

    <div class="wheel-area">
      <SpinWheel></SpinWheel>
    </div>
  </div>

  <SidebarPanel></SidebarPanel>
  <Button
    severity="info"
    text
    rounded
    icon="pi pi-angle-double-left"
    aria-label="Open sidebar"
    class="overflow-visible sidebar-button"
    @click="sidebarService?.openSidebar"
    :pt="{
      icon: { style: { fontSize: 'xx-large' } }
    }"
  />
  <DynamicDialog />
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { SidebarService } from '@/services/SidebarService';
import { DarkMode } from '@/services/SettingService';

const sidebarService = inject<SidebarService>('SidebarService');
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
  color: var(--text-primary);
}

.header {
  font-family: var(--display-font);
  letter-spacing: 0.02em;
  flex-shrink: 0;
  padding-top: 0.5rem;

  h1 {
    font-size: xxx-large;
  }
}

.wheel-area {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2328;
  transition: transform 0.2s, box-shadow 0.2s;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.sidebar-button {
  position: fixed;
  top: calc(50% - 25px);
  right: 1rem;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  z-index: 999;
  box-shadow: 0 10px 30px rgba(31, 35, 40, 0.12);
}
</style>
