import CommandSshService from '../command_ssh_service.ts'

export default class PortStatusCmdService {
  constructor(private ssh: CommandSshService) {}

  async send(): Promise<any[]> {
    this.ssh.append('show port status')

    await this.ssh.connect()
    const response = await this.ssh.commit()
    this.ssh.disconnect()

    return this.parse(response)
  }

  private parse(raw: string): any[] {
    const rows = raw.split('\n')

    const regexPortName = /^[a-z]+\.[0-9]+\.[0-9]+/gm
    const regexPortAlias = /(?<=(^[a-z]+\.[0-9]+\.[0-9]+\s+))(?!(Down|Up))[a-zA-z-+=\#\/]+/gm
    const regexOperationStatus = /(?<=(^[a-z]+\.[0-9]+\.[0-9]+.*))(Down|Up)/gm
    const regexAdminStatus = /(?<=(^[a-z]+\.[0-9]+\.[0-9]+.*)(Down|Up)\s+)(Down|Up)/gm
    const regexSpeed = /(?<=(^[a-z]+\.[0-9]+\.[0-9]+.*)(Down|Up)\s+(Down|Up)\s+)[a-zA-Z0-9.\/]+/gm

    const response = rows
      .map((row) => {
        const portName = row.match(regexPortName) ?? []
        const portAlias = row.match(regexPortAlias) ?? []
        const operationStatus = row.match(regexOperationStatus) ?? []
        const adminStatus = row.match(regexAdminStatus) ?? []
        const speed = row.match(regexSpeed) ?? []

        return {
          portName: portName[0],
          portAlias: portAlias[0] ?? '',
          operationStatus: operationStatus[0] ?? '',
          adminStatus: adminStatus[0] ?? '',
          speed: speed[0] ?? '',
        }
      })
      .filter((port) => port.portName !== undefined)

    return response
  }
}
