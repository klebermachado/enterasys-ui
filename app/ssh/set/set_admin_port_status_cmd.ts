import SSH from '../../services/ssh.js'

export default async function setAdminPortStatusCmd(
  connection: SSH,
  portName: string,
  toggle: 'up' | 'down'
): Promise<void> {
  if (toggle === 'up') {
    await connection.exec(`set port enable ${portName}`)
  } else {
    await connection.exec(`set port disable ${portName}`)
  }
}
