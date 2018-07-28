'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var expo = require('expo');

var STRINGS = {
  en: {
    [expo.Contacts.Fields.ID]: 'ID',
    [expo.Contacts.Fields.ContactType]: 'Contact Type',
    [expo.Contacts.Fields.Name]: 'Name',
    [expo.Contacts.Fields.FirstName]: 'First Name',
    [expo.Contacts.Fields.MiddleName]: 'Middle Name',
    [expo.Contacts.Fields.LastName]: 'Last Name',
    [expo.Contacts.Fields.MaidenName]: 'Maiden Name',
    [expo.Contacts.Fields.NamePrefix]: 'Prefix',
    [expo.Contacts.Fields.NameSuffix]: 'Suffix',
    [expo.Contacts.Fields.Nickname]: 'Nickname',
    [expo.Contacts.Fields.PhoneticFirstName]: 'Phonetic First Name',
    [expo.Contacts.Fields.PhoneticMiddleName]: 'Phonetic Middle Name',
    [expo.Contacts.Fields.PhoneticLastName]: 'Phonetic Last Name',
    [expo.Contacts.Fields.Birthday]: 'Birthday',
    [expo.Contacts.Fields.NonGregorianBirthday]: 'Non-Gregorian Birthday',
    [expo.Contacts.Fields.Emails]: 'Email Addresses',
    [expo.Contacts.Fields.PhoneNumbers]: 'Phone Numbers',
    [expo.Contacts.Fields.Addresses]: 'Addresses',
    [expo.Contacts.Fields.SocialProfiles]: 'Social Profiles',
    [expo.Contacts.Fields.InstantMessageAddresses]: 'Instant Message Addresses',
    [expo.Contacts.Fields.UrlAddresses]: 'URL Addresses',
    [expo.Contacts.Fields.Company]: 'Company',
    [expo.Contacts.Fields.JobTitle]: 'Job Title',
    [expo.Contacts.Fields.Department]: 'Department',
    [expo.Contacts.Fields.ImageAvailable]: 'Image Available',
    [expo.Contacts.Fields.Image]: 'Image',
    [expo.Contacts.Fields.RawImage]: 'Raw Image',
    [expo.Contacts.Fields.Note]: 'Note',
    [expo.Contacts.Fields.Dates]: 'Dates',
    [expo.Contacts.Fields.Relationships]: 'Relationships',
  },
};

// 

const { Localization } = expo.DangerZone;

// TODO: Export types from expo-sdk

let _locale;

function parseDate({ year, month, day, format }) {
  let nYear = year || new Date().getFullYear();
  // TODO: Evan: add support for calendars: https://github.com/moment/moment/issues/1454
  const date = new Date(nYear, month, day, 0, 0);
  return date;
}

function formatAddress({ city, country, postalCode, region, street }) {
  const address = [street, city, region, postalCode, country]
    .filter(item => item !== '')
    .join(', ');
  return address;
}

async function nameForFieldAsync(key, strings = STRINGS) {
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

function getPrimaryEntry(items) {
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

async function getGroupWithNameAsync(groupName) {
  const groups = await expo.Contacts.getGroupsAsync({ groupName });
  if (groups && groups.length > 0) {
    return groups[0];
  }
  return null;
}

async function duplicateContactWithIdAsync(contactId) {
  const contact = await expo.Contacts.getContactByIdAsync(contactId);
  if (contact) {
    return expo.Contacts.addContactAsync(contact);
  }
}

async function ensureGroupWithNameExistsAsync(groupName) {
  const group = await getGroupWithNameAsync(groupName);
  if (!group || !group.id) {
    return expo.Contacts.createGroupAsync(groupName);
  }
  return group.id;
}

async function deleteGroupWithNameAsync(groupName) {
  const group = await getGroupWithNameAsync(groupName);
  if (group) {
    return expo.Contacts.removeGroupAsync(group.id);
  }
}

async function removeAllChildrenFromGroupWithNameAsync(groupName) {
  const groupId = await ensureGroupWithNameExistsAsync(groupName);

  const payload = await expo.Contacts.getContactsAsync({ groupId });
  if (payload && payload.data) {
    return Promise.all(
      payload.data.map(contact => expo.Contacts.removeContactFromGroupAsync(contact.id, groupId))
    );
  }
}

function presentNewContactFormAsync({ contact, options } = {}) {
  return expo.Contacts.presentFormAsync(null, contact, { ...options, isNew: true });
}

function presentUnknownContactFormAsync({
  contact,
  options,
} = {}) {
  return expo.Contacts.presentFormAsync(null, contact, { ...options, isNew: false });
}

function presentContactInfoFormAsync({ contact, options } = {}) {
  return expo.Contacts.presentFormAsync(contact.id, null, { ...options, isNew: false });
}

var ContactUtils = /*#__PURE__*/Object.freeze({
  parseDate: parseDate,
  formatAddress: formatAddress,
  nameForFieldAsync: nameForFieldAsync,
  getPrimaryEntry: getPrimaryEntry,
  getGroupWithNameAsync: getGroupWithNameAsync,
  duplicateContactWithIdAsync: duplicateContactWithIdAsync,
  ensureGroupWithNameExistsAsync: ensureGroupWithNameExistsAsync,
  deleteGroupWithNameAsync: deleteGroupWithNameAsync,
  removeAllChildrenFromGroupWithNameAsync: removeAllChildrenFromGroupWithNameAsync,
  presentNewContactFormAsync: presentNewContactFormAsync,
  presentUnknownContactFormAsync: presentUnknownContactFormAsync,
  presentContactInfoFormAsync: presentContactInfoFormAsync
});

exports.default = ContactUtils;
exports.parseDate = parseDate;
exports.formatAddress = formatAddress;
exports.nameForFieldAsync = nameForFieldAsync;
exports.getPrimaryEntry = getPrimaryEntry;
exports.getGroupWithNameAsync = getGroupWithNameAsync;
exports.duplicateContactWithIdAsync = duplicateContactWithIdAsync;
exports.ensureGroupWithNameExistsAsync = ensureGroupWithNameExistsAsync;
exports.deleteGroupWithNameAsync = deleteGroupWithNameAsync;
exports.removeAllChildrenFromGroupWithNameAsync = removeAllChildrenFromGroupWithNameAsync;
exports.presentNewContactFormAsync = presentNewContactFormAsync;
exports.presentUnknownContactFormAsync = presentUnknownContactFormAsync;
exports.presentContactInfoFormAsync = presentContactInfoFormAsync;
