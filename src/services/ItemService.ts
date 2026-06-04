import { ref } from 'vue';
import type { IItem } from '@/interface/IItem';
import { templateItems } from '@/assets/TemplateData';
import { Fairmode } from './SettingService';

const STORAGE_KEY = 'spin-items';

export const GroupLabel = ref<string>();
export const GroupLabels = ref<string[]>([]);
export const Items = ref<IItem[]>();

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadAll(): IItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(items: IItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export class ItemService {
  async init() {
    let all = loadAll();
    if (all.length === 0) {
      all = templateItems.map((t) => ({ ...t, _id: genId() }));
      saveAll(all);
    }
    await this.resetGroupLabel();
    Items.value = await this.getItems();
  }

  public getGroupLabels = async (): Promise<string[]> => [
    ...new Set(loadAll().map((item) => item.group).filter(Boolean).sort())
  ];

  public getItems = async (): Promise<IItem[]> =>
    this.getItemByGroupLabel(GroupLabel.value || (await this.getFirstItem()).group);

  public getItemByGroupLabel = async (groupLabel: string): Promise<IItem[]> =>
    loadAll()
      .filter((item) => item.group === groupLabel)
      .sort((a, b) => a.order - b.order)
      .map((p) => {
        const copy = { ...p };
        if (Fairmode.value) {
          copy.weight = 1;
        }
        return copy;
      });

  private syncGroups = async () => (GroupLabels.value = await this.getGroupLabels());
  public syncItems = async () => (Items.value = await this.getItems());

  public addItem = async (item?: IItem) => {
    const all = loadAll();
    if (!item) {
      item = {
        group: GroupLabel.value ?? 'New Set',
        label: 'New Topic',
        weight: 1,
        order: all.length
      };
    }
    const doc = { ...item, _id: item._id || genId() };
    all.push(doc);
    saveAll(all);
    await this.syncGroups();
    await this.syncItems();
  };

  private insertTemplateItems = () => {
    const all = templateItems.map((t) => ({ ...t, _id: genId() }));
    saveAll(all);
  };

  private _firstItem: IItem | undefined;

  public async getFirstItem(): Promise<IItem> {
    if (this._firstItem) return this._firstItem;

    const all = loadAll().sort((a, b) => a.order - b.order);
    if (all.length === 0) {
      this.insertTemplateItems();
      Items.value = await this.getItems();
      return this.getFirstItem();
    } else {
      this._firstItem = all[0];
      return this._firstItem!;
    }
  }

  public changeGroupLabel = async (newGroupLabel: string) => {
    if (newGroupLabel !== GroupLabel.value) {
      GroupLabel.value = newGroupLabel;
    }
    await this.syncItems();
  };

  public async resetWeights() {
    const all = loadAll();
    all.forEach((item) => {
      if (item.group === GroupLabel.value) {
        item.weight = 1;
      }
    });
    saveAll(all);
    await this.syncItems();
  }

  public async resetGroupLabel() {
    const firstItem = await this.getFirstItem();
    GroupLabel.value = firstItem.group;
    await this.syncGroups();
    await this.syncItems();
  }

  public async updateItem(item: IItem) {
    const all = loadAll();
    const idx = all.findIndex((i) => i._id === item._id);
    if (idx === -1) return;

    if (all[idx].label === item.label && all[idx].weight === item.weight) return;

    all[idx].label = item.label;
    if (!Fairmode.value) all[idx].weight = item.weight;
    saveAll(all);
    await this.syncItems();
  }

  public removeItem = async (item: IItem) => {
    const all = loadAll().filter((i) => i._id !== item._id);
    saveAll(all);
    await this.syncItems();
  };
}
