import SSH from '../../services/ssh'

export default async function showPortAliasCmd(connection: SSH, portName?: string): Promise<any[]> {
  const response = await connection.exec(`show port alias ${portName ?? ''}`)
  return parse(response)
}

function parse(raw: string): any {
  if (raw.includes('Invalid Port')) {
    return []
  }
  const rows = raw
    .split('\r')
    .filter((column, index) => index !== 0)
    .filter((column) => column !== '\n')
  const entries = []

  for (const row of rows) {
    const columns = row
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter((column) => column !== '')
    entries.push(columns)
  }
  return entries.map((entry) => ({ portName: entry[1], alias: entry[2] ?? '' }))
}
