import SSH from '../../services/ssh.js'

export default async function showConfigCmd(connection: SSH): Promise<string> {
  return connection.exec('show config')
}
