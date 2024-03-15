import CommandSshService from '../command_ssh_service.ts'

export default class ShowSystemService {
  constructor(private ssh: CommandSshService) {}

  async send(): Promise<any> {
    this.ssh.append('show system')

    await this.ssh.connect()
    const response = await this.ssh.commit()
    this.ssh.disconnect()

    return this.parse(response)
  }

  private parse(raw: string): any {
    const regexSystemName = /(?<=(System\sname:\s+))[a-zA-Z0-9\-\\_\#]+/gm
    const regexSystemLocation = /(?<=(System\slocation:\s+))[a-zA-Z0-9\-\\_\#]+/gm

    const systemName = raw.match(regexSystemName) ?? []
    const systemLocation = raw.match(regexSystemLocation) ?? []

    const response = {
      systemName: systemName[0],
      systemLocation: systemLocation[0],
    }

    return response
  }
}
