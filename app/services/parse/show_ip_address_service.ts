import CommandSshService from '../command_ssh_service.ts'

export default class ShowIpAddressService {
  constructor(private ssh: CommandSshService) {}

  async send(): Promise<any> {
    this.ssh.append('show ip address')

    await this.ssh.connect()
    const response = await this.ssh.commit()
    this.ssh.disconnect()

    return this.parse(response)
  }

  private parse(raw: string): any {
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
}
