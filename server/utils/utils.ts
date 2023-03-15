const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const containsAll = <T>(array1: T[], array2: T[]) =>
  array2.every(arr2Item => array1.find(arr1Item => deepEqual(arr1Item, arr2Item)))

export const sameMembers = <T>(array1: T[], array2: T[]) => containsAll(array1, array2) && containsAll(array2, array1)

export const deepEqual = <T>(x: T, y: T): boolean => {
  const ok = Object.keys
  const tx = typeof x
  const ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key]))
    : x === y
}

export const dateItems = (year: string, month: string, day: string) => {
  return [
    {
      name: 'day',
      classes: 'govuk-input--width-2',
      value: day,
    },
    {
      name: 'month',
      classes: 'govuk-input--width-2',
      value: month,
    },
    {
      name: 'year',
      classes: 'govuk-input--width-4',
      value: year,
    },
  ]
}
