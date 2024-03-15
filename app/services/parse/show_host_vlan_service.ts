import CommandSshService from '../command_ssh_service.ts'

export default class ShowHostVlanService {
  constructor(private ssh: CommandSshService) {}

  async send(): Promise<any> {
    this.ssh.append('show host vlan')

    await this.ssh.connect()
    const response = await this.ssh.commit()
    this.ssh.disconnect()

    return this.parse(response)
  }

  private parse(raw: string): any {
    const regexHostVlan = /(?<=is\s)[0-9]+/gm

    const hostVlan = raw.match(regexHostVlan) ?? []
    const response = {
      hostVlan: hostVlan[0],
    }

    return response
  }
}
