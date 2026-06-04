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
      <p class="my-0 py-0 text-base sm:text-lg md:text-2xl" v-if="!Fairmode">
        <span class="white-space-nowrap">Life is Unfair.</span>
        &nbsp;<span class="white-space-nowrap">Just Like Our Wheel.😈</span>
      </p>
      <p class="my-0 py-0 text-base sm:text-lg md:text-2xl" v-else>
        <span class="white-space-nowrap">Balanced mode gives every topic</span>
        &nbsp;<span class="white-space-nowrap">an even chance.</span>
      </p>
      <button class="theme-toggle" @click="DarkMode = !DarkMode" aria-label="Toggle theme">
        <svg v-if="DarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
    <div class="wheel-area">
      <SpinWheel></SpinWheel>
    </div>
    <div class="footer-area">
      <AppFooter></AppFooter>
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
  <Dialog v-model:visible="showInputGroupDialog" modal dismissableMask header="Header">
    <template #container>
      <form class="surface-card border-round shadow-2 p-4 max-w-screen" @submit.prevent>
        <div class="text-900 font-medium mb-2 text-xl">Import Set</div>
        <p class="text-color-secondary w-24rem">
          This set name already exists in
          <span class="white-space-nowrap">your library.</span>
        </p>
        <p class="text-color-secondary w-24rem">
          Choose a different set name or
          <span class="text-red-300 white-space-nowrap">replace the existing one.</span>
        </p>
        <div class="flex mb-4 flex-column lg:flex-row">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-file-import" />
            <InputText
              autofocus
              v-model="inputGroupName"
              placeholder="New Set Name"
              :pt="{
                root: { class: 'w-full' }
              }"
            />
          </span>
        </div>
        <Button
          type="submit"
          class="confirm-button"
          icon="pi pi-check"
          :label="GroupLabels.indexOf(inputGroupName) > -1 ? 'Replace' : 'Import'"
          :severity="GroupLabels.indexOf(inputGroupName) > -1 ? 'danger' : 'success'"
          @click="inputGroup"
        ></Button>
      </form>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { SidebarService } from '@/services/SidebarService';
import { ItemService, GroupLabels } from '@/services/ItemService';
import { StringHelper } from '@/helpers/StringHelper';
import { DarkMode, Fairmode } from '@/services/SettingService';

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const sidebarService = inject<SidebarService>('SidebarService');
const itemService = inject<ItemService>('ItemService');

let inputItems: { label: string; weight: number }[] = [];
const showInputGroupDialog = ref(false);
const inputGroupName = ref('');
const inputGroup = async () => {
  if (!itemService) return;

  await itemService.cleanUpGroup(inputGroupName.value);
  await itemService.addItems(
    inputItems.map((item) => ({
      label: item.label,
      weight: +item.weight,
      group: inputGroupName.value,
      order: -1
    }))
  );
  await itemService.changeGroupLabel(inputGroupName.value);
  showInputGroupDialog.value = false;
  inputGroupName.value = '';

  // Remove query string
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('data');
  searchParams.delete('group');
  var url =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    (searchParams.size ? '?' + searchParams.toString() : '');
  window.history.pushState({ path: url }, '', url);
};

onMounted(async () => {
  if (import.meta.env.DEV) {
    // Add dummy gtag for dev
    window.gtag = (...args: any[]) => {
      console.debug('gtag', ...args);
    };
  } else if (navigator.globalPrivacyControl) {
    // Don't track if user has enabled Global Privacy Control
    window.gtag = () => {};
    console.log(
      '%cWe can see that you have enabled the Global Privacy Control, indicating that you do not wish to have your information sold or shared.',
      'font-weight:bold; color: lightgreen;',
      '\nYour privacy is important to us, and we completely honor your choice.',
      'As a result, we have deactivated Google Analytics, Microsoft Clarity, and Cloudflare RUM. 😉'
    );
  } else if (navigator.userAgent.indexOf('OBS') > 0) {
    // Don't track in OBS mode to reduce performance impact
    window.gtag = () => {};
  } else if (import.meta.env.PROD) {
    // Setup Cloudflare RUM (Real User Measurements)
    if (import.meta.env.VITE_CLOUDFLARE_RUM_TOKEN) {
      (function (token) {
        const rumScript = document.createElement('script');
        rumScript.defer = true;
        rumScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        rumScript.setAttribute('data-cf-beacon', JSON.stringify({ token: token }));
        document.head.appendChild(rumScript);
      })(import.meta.env.VITE_CLOUDFLARE_RUM_TOKEN);
    }

    // Setup GA
    (function (id) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;

      document.head.appendChild(gtagScript);

      const dataLayerScript = document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');`;
      document.head.appendChild(dataLayerScript);
    })(import.meta.env.VITE_GA_TRACKING_ID);

    // Setup Clarity
    (function (c: any, l: Document, a: string, r: string, i: string, t: any, y: any) {
      c[a] =
        c[a] ||
        function (...args: any[]) {
          (c[a].q = c[a].q || []).push(args);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(
      window,
      document,
      'clarity',
      'script',
      import.meta.env.VITE_CLARITY_TRACKING_ID,
      undefined,
      undefined
    );
  }

  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  const group = params.get('group') ?? 'New Group Name';
  if (data) {
    try {
      inputGroupName.value = decodeURIComponent(group);
      console.debug('inputGroupName', inputGroupName.value);

      const decompressed = StringHelper.decompress(data);
      inputItems = StringHelper.csvParse(decompressed);
      console.debug('inputItems', inputItems);

      if ((await itemService?.getItemByGroupLabel(inputGroupName.value))?.length) {
        inputGroupName.value += ' (1)';
        showInputGroupDialog.value = true;
      } else {
        await inputGroup();
      }
    } catch (e) {
      console.error('Failed to parsed data from url segment!', e);
    }
  }
});
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
  p {
    font-size: large;
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

.footer-area {
  flex-shrink: 0;
}

.confirm-button {
  float: right;
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
