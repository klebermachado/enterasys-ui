import CommandSshService from '../command_ssh_service.ts'

export default class SetPortAliasService {
  constructor(private ssh: CommandSshService) {}

  async send(portName: string, alias: string): Promise<void> {
    this.ssh.append(`set port alias ${portName} ${alias}`)

    await this.ssh.connect()
    const result = await this.ssh.commit()

    const success = await this.verifySuccessCommand(portName, alias)
    if (!success) {
      throw new Error('Error setting port alias')
    }

    this.ssh.disconnect()
  }

  private async verifySuccessCommand(portName: string, alias: string): Promise<boolean> {
    this.ssh.clear()
    await this.ssh.connect()
    this.ssh.append(`show port alias ${portName}`)
    const rawResponse: string = await this.ssh.commit()
    const regexFindPort = new RegExp(`(${portName}\\s).*(${alias})`, 'm')
    const findRow = rawResponse.match(regexFindPort)
    if (findRow) {
      return true
    }
    return false
  }
}
