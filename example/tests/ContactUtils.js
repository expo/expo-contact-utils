'use strict';
import ContactUtils from '@expo/contact-utils';
import { Contacts } from 'expo';
import { Platform } from 'react-native';

import * as TestUtils from '../TestUtils';

export const name = 'Contacts';

function shallowCompare(a, b) {
  for (const key of Object.keys(a)) {
    console.log('compare', key, a[key], b[key]);
    if (key !== 'id' && a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export async function test(t) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  describeWithPermissions('Contacts', () => {
    let firstContact;

    if (Platform.OS === 'ios') {
      let customContactId;
      t.describe('ContactUtils.formatAddress()', () => {
        t.it('gets format for address components', async () => {
          const address = {
            label: 'Expo',
            city: 'Palo Alto',
            country: 'United States',
            postalCode: '94301',
            region: 'CA',
            street: '420 Florence St',
          };

          customContactId = await Contacts.addContactAsync({
            [Contacts.Fields.FirstName]: 'Evany',
            [Contacts.Fields.LastName]: 'Bae-con',
            [Contacts.Fields.JobTitle]: 'Lego Master',
            [Contacts.Fields.Addresses]: [address],
          });

          const contact = await Contacts.getContactByIdAsync(customContactId);
          const allAddresses = contact[Contacts.Fields.Addresses];
          const primaryAddress = ContactUtils.getPrimaryEntry(allAddresses);
          const formattedAddress = ContactUtils.formatAddress(primaryAddress);

          console.log({ customContactId, contact, allAddresses, formattedAddress });

          t.expect(typeof customContactId).toBe('string');
          t.expect(typeof formattedAddress).toBe('string');
          t.expect(typeof contact).toBe('object');
          t.expect(Contacts.Fields.Addresses in contact).toBe(true);

          // Remove contact
          const success = await Contacts.removeContactAsync(customContactId);
          t.expect(!!success).toBe(true);
        });
      });

      t.describe('ContactUtils.getPrimaryEntry()', () => {
        t.it('gets the main address from contact', async () => {
          const address = {
            label: 'Expo',
            city: 'Palo Alto',
            country: 'United States',
            postalCode: '94301',
            region: 'CA',
            street: '420 Florence St',
          };

          const homeAddress = {
            label: 'home',
            city: 'Austin',
            country: 'United States',
            postalCode: '78704',
            region: 'TX',
            street: '3701 S Lamar Blvd',
          };

          customContactId = await Contacts.addContactAsync({
            [Contacts.Fields.FirstName]: 'Evany',
            [Contacts.Fields.LastName]: 'Bae-con',
            [Contacts.Fields.JobTitle]: 'Lego Master',
            [Contacts.Fields.Addresses]: [homeAddress, address],
          });

          const contact = await Contacts.getContactByIdAsync(customContactId);
          const allAddresses = contact[Contacts.Fields.Addresses];
          const primaryAddress = ContactUtils.getPrimaryEntry(allAddresses);
          const formattedAddress = ContactUtils.formatAddress(primaryAddress);

          console.log({ customContactId, contact, allAddresses, formattedAddress });

          t.expect(typeof customContactId).toBe('string');
          t.expect(typeof formattedAddress).toBe('string');
          t.expect(typeof contact).toBe('object');
          t.expect(Contacts.Fields.Addresses in contact).toBe(true);
          t.expect(Array.isArray(contact[Contacts.Fields.Addresses])).toBe(true);
          t.expect(shallowCompare(homeAddress, primaryAddress)).toBe(true);

          // Remove contact
          const success = await Contacts.removeContactAsync(customContactId);
          t.expect(!!success).toBe(true);
        });
      });
    }
  });
}
