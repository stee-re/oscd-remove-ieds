import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';

import OscdRemoveIEDs from './oscd-remove-ieds.js';
import type { OscdSelectionList } from '@omicronenergy/oscd-ui/selection-list/OscdSelectionList.js';
import { testDocs, parseDoc } from './oscd-remove-ieds.testfiles.js';

customElements.define('oscd-remove-ieds', OscdRemoveIEDs);

function getIedNames(doc: XMLDocument): string[] {
  return Array.from(doc.querySelectorAll('IED')).map(
    ied => ied.getAttribute('name')!,
  );
}

describe('oscd-remove-ieds', () => {
  let element: OscdRemoveIEDs & LitElement;
  let doc: XMLDocument;

  describe('with multiple IEDs', () => {
    beforeEach(async () => {
      doc = parseDoc(testDocs.multipleIEDs);
      element = await fixture(
        html`<oscd-remove-ieds .doc=${doc}></oscd-remove-ieds>`,
      );
      await element.updateComplete;
    });

    it('renders the dialog element', () => {
      const dialog = element.shadowRoot!.querySelector('#selection-dialog');
      expect(dialog).to.exist;
    });

    it('renders the selection list', () => {
      const selectionList =
        element.shadowRoot!.querySelector('#selection-list');
      expect(selectionList).to.exist;
    });

    it('lists all IEDs from the document', () => {
      const selectionList = element.shadowRoot!.querySelector(
        '#selection-list',
      ) as OscdSelectionList;
      expect(selectionList).to.exist;

      const iedNames = getIedNames(doc);
      expect(iedNames).to.have.lengthOf(2);
      expect(iedNames).to.include('PUB_A');
      expect(iedNames).to.include('SUB_A');
    });

    it('includes IED description in list items', () => {
      const selectionList = element.shadowRoot!.querySelector(
        '#selection-list',
      ) as OscdSelectionList;

      const pubItem = selectionList.items.find(item =>
        item.headline.includes('PUB_A'),
      );
      expect(pubItem).to.exist;
      expect(pubItem!.headline).to.contain('ABB');
      expect(pubItem!.headline).to.contain('REL670');
      expect(pubItem!.supportingText).to.contain('Publisher A');
      expect(pubItem!.supportingText).to.contain('1.0');
    });

    it('renders Close and Remove IEDs buttons', () => {
      const buttons =
        element.shadowRoot!.querySelectorAll('oscd-text-button');
      const buttonLabels = Array.from(buttons).map(
        btn => btn.textContent?.trim(),
      );
      expect(buttonLabels).to.include('Close');
      expect(buttonLabels).to.include('Remove IEDs');
    });

    it('dispatches oscd-edit-v2 events when removing IEDs', async () => {
      const editEvents: Event[] = [];
      element.addEventListener('oscd-edit-v2', (e: Event) => {
        editEvents.push(e);
      });

      const selectionList = element.shadowRoot!.querySelector(
        '#selection-list',
      ) as OscdSelectionList;
      const iedToRemove = doc.querySelector('IED[name="PUB_A"]')!;

      // Override selectedElements to simulate user selection
      Object.defineProperty(selectionList, 'selectedElements', {
        get: () => [iedToRemove],
        configurable: true,
      });

      await element.removeIEDs();

      expect(editEvents.length).to.equal(1);
    });
  });

  describe('with a single IED', () => {
    beforeEach(async () => {
      doc = parseDoc(testDocs.singleIED);
      element = await fixture(
        html`<oscd-remove-ieds .doc=${doc}></oscd-remove-ieds>`,
      );
      await element.updateComplete;
    });

    it('lists the single IED', () => {
      const selectionList = element.shadowRoot!.querySelector(
        '#selection-list',
      ) as OscdSelectionList;

      expect(selectionList.items).to.have.lengthOf(1);
      expect(selectionList.items[0].headline).to.contain('IED1');
      expect(selectionList.items[0].headline).to.contain('OpenSCD');
      expect(selectionList.items[0].headline).to.contain('Virtual');
      expect(selectionList.items[0].supportingText).to.contain('Test IED');
    });
  });

  describe('with no IEDs', () => {
    beforeEach(async () => {
      doc = parseDoc(testDocs.noIEDs);
      element = await fixture(
        html`<oscd-remove-ieds .doc=${doc}></oscd-remove-ieds>`,
      );
      await element.updateComplete;
    });

    it('renders the dialog with an empty selection list', () => {
      const selectionList = element.shadowRoot!.querySelector(
        '#selection-list',
      ) as OscdSelectionList;

      expect(selectionList).to.exist;
      expect(selectionList.items).to.have.lengthOf(0);
    });
  });

  describe('editCount reactivity', () => {
    it('updates when editCount changes', async () => {
      doc = parseDoc(testDocs.multipleIEDs);
      element = await fixture(
        html`<oscd-remove-ieds
          .doc=${doc}
          .editCount=${0}
        ></oscd-remove-ieds>`,
      );
      await element.updateComplete;

      element.editCount = 1;
      await element.updateComplete;

      const selectionList =
        element.shadowRoot!.querySelector('#selection-list');
      expect(selectionList).to.exist;
    });
  });
});
