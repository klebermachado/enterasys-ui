import { inject } from '@adonisjs/core'
import { Client } from 'ssh2'

@inject()
export default class CommandSshService {
  private conn = new Client()
  credentials: {}
  private commands: string[] = []

  constructor(credentials: any) {
    this.credentials = {
      port: 22,
      username: 'admin',
      password: '',
      algorithms: {
        kex: ['diffie-hellman-group14-sha1'],
        serverHostKey: ['ssh-dss', 'ssh-rsa'],
      },
      ...credentials,
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.on('ready', () => resolve()).connect(this.credentials)
      this.conn.on('error', (err: any) => reject(err))
    })
  }

  append(command: string) {
    this.commands.push(command + '\n')
  }

  async commit(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.conn.shell((err: any, stream: any) => {
        if (err) reject(err)
        let dataBuffer = ''

        stream
          .on('close', () => {
            this.conn.end()
            resolve(dataBuffer)
          })
          .on('data', (data: string) => {
            dataBuffer += data
          })
          .on('end', () => {
            resolve(dataBuffer)
          })

        for (const command of this.commands) {
          stream.write(command)
        }
        stream.end()
      })
    })
  }

  disconnect() {
    this.conn.end()
  }
}
