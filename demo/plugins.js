import OscdMenuOpen from '@omicronenergy/oscd-menu-open';
import OscdMenuSave from '@omicronenergy/oscd-menu-save';

import OscdRemoveIEDs from '../dist/oscd-remove-ieds.js';

const oscdShell = document.querySelector('oscd-shell');
const registry = oscdShell?.registry;
if (!registry) {
  throw new Error('No registry found on oscd-shell');
}
registry.define('oscd-menu-open', OscdMenuOpen);
registry.define('oscd-menu-save', OscdMenuSave);
registry.define('oscd-remove-ieds', OscdRemoveIEDs);

export const plugins = {
  menu: [
    {
      name: 'Open File',
      translations: { de: 'Datei öffnen' },
      icon: 'folder_open',
      tagName: 'oscd-menu-open',
    },
    {
      name: 'Save File',
      translations: { de: 'Datei speichern' },
      icon: 'save',
      requireDoc: true,
      tagName: 'oscd-menu-save',
    },
    {
      name: 'Validating',
      translations: {
        de: 'Validieren',
      },
      icon: 'rule_folder',
      requireDoc: true,
      src: 'https://omicronenergyoss.github.io/oscd-menu-validate/oscd-menu-validate.js',
    },
    {
      name: 'Remove IEDs',
      icon: 'delete',
      active: true,
      requireDoc: true,
      tagName: 'oscd-remove-ieds',
    },
  ],
  editor: [
    {
      name: 'Source Editor',
      translations: { de: 'Source Editor' },
      icon: 'data_object',
      requireDoc: true,
      src: 'https://omicronenergyoss.github.io/oscd-editor-source/oscd-editor-source.js',
    },
  ],
  background: [],
};
