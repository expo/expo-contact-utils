// @flow
import { Contacts, DangerZone } from 'expo';

import STRINGS from './STRINGS';

const { Localization } = DangerZone;

// TODO: Export types from expo-sdk
type ContactFormOptions = {
  contact: Object,
  options: Object,
};

let _locale;

export function parseDate({ year, month, day, format }): Date {
  let nYear = year || new Date().getFullYear();
  // TODO: Evan: add support for calendars: https://github.com/moment/moment/issues/1454
  const date = new Date(nYear, month, day, 0, 0);
  return date;
}

export function formatAddress({ city, country, postalCode, region, street }): string {
  const address = [street, city, region, postalCode, country]
    .filter(item => item !== '')
    .join(', ');
  return address;
}

export async function nameForFieldAsync(key: string, strings = STRINGS): ?string {
  if (!strings) {
    return null;
  } else if (Array.isArray(strings)) {
    return strings[key];
  }

  if (!_locale) {
    const locale = await Localization.getCurrentLocaleAsync();
    const localeStr = locale.substring(0, 2);
    _locale = localeStr;
  }

  if (!(_locale in strings)) {
    console.warn('ContactUtils.nameForFieldAsync: Unsupported language:', _locale);
    return null;
  }
  const field = strings[_locale] ? strings[_locale][key] : null;

  if (!field) {
    return '...';
  }
  return field.toString();
}

export function getPrimaryEntry(items: Array): ?Object {
  if (items) {
    const primary = items.filter(({ isPrimary }) => isPrimary);
    if (primary.length > 0) {
      return primary[0];
    } else {
      const home = items.filter(({ label }) => {
        if (typeof label === 'string') {
          return label.toLowerCase() === 'home';
        }
        return false;
      });
      if (home.length > 0) {
        return home[0];
      }
    }
    return items[0];
  }
  return null;
}

export async function getGroupWithNameAsync(groupName: string): Promise<?Group> {
  const groups = await Contacts.getGroupsAsync({ groupName });
  if (groups && groups.length > 0) {
    return groups[0];
  }
  return null;
}

export async function duplicateContactWithIdAsync(contactId: string): Promise<string> {
  const contact = await Contacts.getContactByIdAsync(contactId);
  if (contact) {
    return Contacts.addContactAsync(contact);
  }
}

export async function ensureGroupWithNameExistsAsync(groupName: string): Promise<string> {
  const group = await getGroupWithNameAsync(groupName);
  if (!group || !group.id) {
    return Contacts.createGroupAsync(groupName);
  }
  return group.id;
}

export async function deleteGroupWithNameAsync(groupName: string): Promise<any> {
  const group = await getGroupWithNameAsync(groupName);
  if (group) {
    return Contacts.removeGroupAsync(group.id);
  }
}

export async function removeAllChildrenFromGroupWithNameAsync(groupName: string): Promise<any> {
  const groupId = await ensureGroupWithNameExistsAsync(groupName);

  const payload = await Contacts.getContactsAsync({ groupId });
  if (payload && payload.data) {
    return Promise.all(
      payload.data.map(contact => Contacts.removeContactFromGroupAsync(contact.id, groupId))
    );
  }
}

export function presentNewContactFormAsync({ contact, options }: ContactFormOptions = {}): Promise<
  any
> {
  return Contacts.presentFormAsync(null, contact, { ...options, isNew: true });
}

export function presentUnknownContactFormAsync({
  contact,
  options,
}: ContactFormOptions = {}): Promise<any> {
  return Contacts.presentFormAsync(null, contact, { ...options, isNew: false });
}

export function presentContactInfoFormAsync({ contact, options }: ContactFormOptions = {}): Promise<
  any
> {
  return Contacts.presentFormAsync(contact.id, null, { ...options, isNew: false });
}
