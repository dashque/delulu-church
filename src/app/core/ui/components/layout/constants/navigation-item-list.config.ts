import type { NavigationItem } from '@core/ui/components/layout/models/navigation-item.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const NAVIGATION_ITEM_LIST = [
  {
    icon: '@tui.sun',
    label: marker('navigation-items.tarot'),
    url: '/',
    exact: true,
  },
  { icon: '@tui.sparkles', label: marker('navigation-items.crystal_ball'), url: '/crystal-ball' },
  {
    icon: '@tui.scroll',
    label: marker('navigation-items.shrift'),
    url: '/shrift',
  },
  {
    icon: '@tui.flame',
    label: marker('navigation-items.altar'),
    url: '/altar',
  },
  {
    icon: '@tui.git-branch',
    label: marker('navigation-items.sanctum'),
    url: '/sanctum',
  },
] as const satisfies NavigationItem[];
