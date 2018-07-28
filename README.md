# expo-contact-utils

[![NPM](https://nodei.co/npm/expo-contact-utils.png)](https://nodei.co/npm/expo-contact-utils/)

## Methods

### parseDate

```js
parseDate({ year, month, day, format }): Date
```

Return a JS Date given a native calendar date.

**Parameters**

| Name           | Type             | Description                                |
| -------------- | ---------------- | ------------------------------------------ |
| calendarFormat | `CalendarFormat` | The shape containing calendar information. |

**Returns**

| Name | Type   | Description        |
| ---- | ------ | ------------------ |
| date | `Date` | A javascript date. |

**Example**

```js
const date = ContactUtils.parseDate({ year, month, day, format });
```

### formatAddress

```js
formatAddress(address: Address): string
```

Return a readable name from native address information.

**Parameters**

| Name    | Type      | Description                                      |
| ------- | --------- | ------------------------------------------------ |
| address | `Address` | The shape containing postal address information. |

**Returns**

| Name          | Type     | Description              |
| ------------- | -------- | ------------------------ |
| formatAddress | `string` | A readable address name. |

**Example**

```js
const address = ContactUtils.formatAddress({
  city,
  country,
  postalCode,
  region,
  street,
});
```

## nameForFieldAsync

```js
nameForFieldAsync(key: ContactField, strings = STRINGS): ?string
```

Get a localized name for a `Contact.Fields` key.

> Only supported language is `en` (US-English) currently.

**Parameters**

| Name    | Type                                   | Description                               |
| ------- | -------------------------------------- | ----------------------------------------- |
| key     | `ContactField`                         | The field you want to get a name for.     |
| strings | `{ [en]: { [ContactField]: string } }` | An alternative list of localized strings. |

**Returns**

| Name | Type      | Description                          |
| ---- | --------- | ------------------------------------ |
| name | `?string` | The name of a supplied ContactField. |

**Example**

```js
const name = await nameForFieldAsync(Contacts.Fields.FirstName);
```

## getPrimaryEntry

```js
getPrimaryEntry(items: Array): ?Object
```

Given a list of contact entries, (like `emails`) this will find the primary entry.

**Parameters**

| Name  | Type                                       | Description                     |
| ----- | ------------------------------------------ | ------------------------------- |
| items | `Array<{ label, id, isPrimary, ...data }>` | An array of contact entry data. |

**Returns**

| Name | Type                                 | Description                                                |
| ---- | ------------------------------------ | ---------------------------------------------------------- |
| item | `?{ label, id, isPrimary, ...data }` | A contact field entry that is the assumed `primary` value. |

**Example**

```js
const primary = getPrimaryEntry(phoneNumbers);
```

## getGroupWithNameAsync

> iOS only

```js
getGroupWithNameAsync(groupName: string): Promise<?Group>
```

Gets the first group with a given name.

**Parameters**

| Name      | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| groupName | `string` | Name of the group you want to query. |

**Returns**

| Name  | Type     | Description                                      |
| ----- | -------- | ------------------------------------------------ |
| group | `?Group` | A group with a name matching the provided query. |

**Example**

```js
const contactGroup = await getGroupWithNameAsync("Expo Programmers")
```

## duplicateContactWithIdAsync

> iOS only

```js
duplicateContactWithIdAsync(contactId: string): Promise<string>
```

Creates a clone of an existing system contact.

**Parameters**

| Name      | Type     | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| contactId | `string` | ID of the existing contact you want to duplicate. |

**Returns**

| Name      | Type     | Description            |
| --------- | -------- | ---------------------- |
| contactId | `string` | ID of the new contact. |

**Example**

```js
const cloneId = await duplicateContactWithIdAsync(contactId)
```

## ensureGroupWithNameExistsAsync

> iOS only

```js
ensureGroupWithNameExistsAsync(groupName: string): Promise<string>
```

Tries to retrieve a contact group, if it cannot be found, create a new contact group with the provided name.

**Parameters**

| Name      | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| groupName | `string` | Name of the group you wish to get. |

**Returns**

| Name    | Type     | Description                  |
| ------- | -------- | ---------------------------- |
| groupId | `string` | ID of the group you ensured. |

**Example**

```js
const groupId = await ensureGroupWithNameExistsAsync("Expo programmers")
```

## deleteGroupWithNameAsync

> iOS only

```js
deleteGroupWithNameAsync(groupName: string): Promise<any>
```

Query a group by name, and delete it.

**Parameters**

| Name      | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| groupName | `string` | Name of the group you want to delete. |

**Example**

```js
await deleteGroupWithNameAsync("Xamarin programmers")
```

## removeAllChildrenFromGroupWithNameAsync

> iOS only

```js
removeAllChildrenFromGroupWithNameAsync(groupName: string): Promise<any>
```

Delete all the contacts from a group.

**Parameters**
| Name | Type | Description |
| ------- | --------- | ------------------------------------------------ |
| groupName | `string` | Name of the target group. |

**Example**

```js
await removeAllChildrenFromGroupWithNameAsync("Xamarin Devs")
```

## presentNewContactFormAsync

```js
presentNewContactFormAsync(options: ContactFormOptions): Promise<any>
```

Present a native modal for adding a new system contact.

**Parameters**

| Name    | Type                 | Description                                       |
| ------- | -------------------- | ------------------------------------------------- |
| options | `ContactFormOptions` | The configuration used for customizing the modal. |

**Example**

```js
await presentNewContactFormAsync({ contact, options })
```

## presentUnknownContactFormAsync

```js
presentUnknownContactFormAsync(options: ContactFormOptions): Promise<any>
```

Present a native modal for an unknown contact.

**Parameters**

| Name    | Type                 | Description                                       |
| ------- | -------------------- | ------------------------------------------------- |
| options | `ContactFormOptions` | The configuration used for customizing the modal. |

**Example**

```js
const data = await presentUnknownContactFormAsync({ contact, options })
```

## presentContactInfoFormAsync

```js
presentContactInfoFormAsync(options: ContactFormOptions): Promise<any>
```

Present a native modal for inspecting contact information.

**Parameters**

| Name    | Type                 | Description                                       |
| ------- | -------------------- | ------------------------------------------------- |
| options | `ContactFormOptions` | The configuration used for customizing the modal. |

**Example**

```js
await presentContactInfoFormAsync({ contact, options })
```

## Types

### ContactFormOptions

| Name    | Type      | Description                        |
| ------- | --------- | ---------------------------------- |
| contact | `Contact` | Contact information for the modal. |
| options | `Object`  | Configuration data for the modal.  |
