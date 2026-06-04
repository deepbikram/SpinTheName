/* eslint-disable vue/multi-word-component-names */
/* eslint-disable vue/no-reserved-component-names */

// Note: Upstream builds included host verification / redirect logic.
// This fork intentionally removes all forced redirects so it can be hosted on any domain.

import { createApp } from 'vue';
import App from '@/App.vue';
import PrimeVue from 'primevue/config';

import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Divider from 'primevue/divider';
import Tooltip from 'primevue/tooltip';
import Sidebar from 'primevue/sidebar';
import ScrollPanel from 'primevue/scrollpanel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Slider from 'primevue/slider';
import Dialog from 'primevue/dialog';
import DynamicDialog from 'primevue/dynamicdialog';
import DialogService from 'primevue/dialogservice';
import Ripple from 'primevue/ripple';
import FocusTrap from 'primevue/focustrap';
import ToggleButton from 'primevue/togglebutton';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import FileUpload from 'primevue/fileupload';

//theme (use neutral light theme; dark mode toggles via `body.dark`)
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@/assets/app.scss';

import SpinWheel from '@/components/SpinWheel.vue';
import ItemInputGroup from '@/components/sidebar-panel/ItemInputGroup.vue';
import SidebarPanel from '@/components/sidebar-panel/SidebarPanel.vue';
import CongratulationDialog from '@/components/CongratulationDialog.vue';

import { ItemService } from '@/services/ItemService';
import { SidebarService } from '@/services/SidebarService';
import { SettingService, DarkMode } from '@/services/SettingService';
import { watch } from 'vue';

const app = createApp(App);
app.use(PrimeVue, {
  ripple: true,
  pt: {
    tabPanel: {
      headerTitle: {
        style: {
          fontWeight: '400'
        }
      }
    }
  }
});
app.use(ConfirmationService);

// PouchDB (local persistence)
const settingService = new SettingService();
await settingService.init();
app.provide('SettingService', settingService);

// Apply initial dark mode class and watch for changes
if (DarkMode.value) document.body.classList.add('dark');
watch(DarkMode, (val) => {
  if (val) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
});

const itemService = new ItemService();
await itemService.init();
app.provide('ItemService', itemService);

const sidebarService = new SidebarService();
app.provide('SidebarService', sidebarService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);
app.component('Sidebar', Sidebar);
app.component('ScrollPanel', ScrollPanel);
app.directive('tooltip', Tooltip);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Slider', Slider);
app.component('Dialog', Dialog);
app.component('DynamicDialog', DynamicDialog);
app.use(DialogService);
app.directive('ripple', Ripple);
app.directive('focustrap', FocusTrap);
app.component('ToggleButton', ToggleButton);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.use(ToastService);
app.component('FileUpload', FileUpload);

app.component('SpinWheel', SpinWheel);
app.component('ItemInputGroup', ItemInputGroup);
app.component('SidebarPanel', SidebarPanel);
app.component('CongratulationDialog', CongratulationDialog);

app.mount('#app');
