import { useQuasar } from 'quasar';

export const parseIcons = () => {
  const iconPath = 'img:../icons/';

  useQuasar().iconMapFn = (iconName) => {
    if (iconName.startsWith('app:'))
      return { icon: iconPath + iconName.substring(4).concat('.svg') };

    return void 0;
  };
};
