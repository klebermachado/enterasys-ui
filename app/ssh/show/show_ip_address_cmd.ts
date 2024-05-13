import SSH from '../../services/ssh.js'

export default async function showIpAddressCmd(connection: SSH) {
  const response = await connection.exec('show ip address')
  return parse(response)
}

function parse(raw: string): any {
  const regexIpAddress = /(?<=((host)\s+))[0-9.]+/gm
  const regexMask = /(?<=((host)\s+)[0-9.]+\s+)[0-9.]+/gm

  const ipAddress = raw.match(regexIpAddress) ?? []
  const mask = raw.match(regexMask) ?? []

  const response = {
    ipAddress: ipAddress[0],
    mask: mask[0],
  }

  return response
}
