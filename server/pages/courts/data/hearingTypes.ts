type hearingType = {
  code: string
  description: string
}

const hearingTypes: hearingType[] = [
  { code: 'TRIAL', description: 'Trial' },
  {
    code: 'NEWTON',
    description: 'Newton hearing',
  },
  // {
  //   code: ''
  //   description:  'Cracked case',
  // }
  //   'Committal for sentence',
  //   'Committal for breach',
]
export default hearingTypes
