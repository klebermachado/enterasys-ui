import CommandSshService from '../command_ssh_service.ts'

export default class SetAdminPortStatus {
  constructor(private ssh: CommandSshService) {}

  async send(portName: string, toggle: 'up' | 'down'): Promise<void> {
    if (toggle === 'up') {
      this.ssh.append(`set port enable ${portName}`)
    } else {
      this.ssh.append(`set port disable ${portName}`)
    }

    await this.ssh.connect()
    await this.ssh.commit()

    this.ssh.disconnect()
  }
}
