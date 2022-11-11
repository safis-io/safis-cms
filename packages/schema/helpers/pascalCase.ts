import startCase from 'lodash.startcase'

const pascalCase = (string = ''): string => startCase(string).replace(/ /g, '')

export default pascalCase
