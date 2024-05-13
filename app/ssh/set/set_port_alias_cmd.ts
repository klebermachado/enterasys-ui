import SSH from '../../services/ssh.js'

export default async function setPortAliasCmd(
  connection: SSH,
  portName: string,
  alias: string
): Promise<void> {
  await connection.exec(`set port alias ${portName} ${alias}`)

  const success = await verifySuccess(connection, portName, alias)
  if (!success) {
    throw new Error('Error setting port alias')
  }
}

async function verifySuccess(connection: SSH, portName: string, alias: string): Promise<boolean> {
  const portAlias = await connection.exec(`show port alias ${portName}`)
  const regexFindPort = new RegExp(`(${portName}\\s).*(${alias})`, 'm')
  const findRow = portAlias.match(regexFindPort)
  if (findRow) {
    return true
  }
  return false
}
