import { inject } from '@adonisjs/core'
import { Client } from 'ssh2'
import { Subject } from 'rxjs'

@inject()
export default class CommandSshService {
  private conn = new Client()
  credentials: {}
  private commands: string[] = []
  private command: string = ''
  response$ = new Subject<string>()
  private stream: any
  private dataBuffer = ''

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

  static async openConnection(credentials: any): Promise<CommandSshService> {
    return new Promise(async (resolve) => {
      const cmd = new CommandSshService(credentials)
      await cmd.connect()

      cmd.conn.shell((err: any, stream: any) => {
        cmd.stream = stream

        cmd.stream.on('data', (data: any) => {
          const regexEndCommand = /^.+\(.+\)\-\>/gm
          const matchEndCommand = data.toString().match(regexEndCommand)

          if (matchEndCommand) {
            const splitted = data.toString().split(regexEndCommand)
            cmd.dataBuffer += splitted[0]

            // Verifica se a resposta não é a apresentação inicial do switch
            if (!cmd.dataBuffer.includes('Command Line Interface')) {
              cmd.response$.next(cmd.dataBuffer)
            }
            cmd.dataBuffer = splitted[1]
          } else {
            cmd.dataBuffer += data
          }
        })

        resolve(cmd)
      })
    })
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

  async exec(command: string): Promise<string> {
    return new Promise(async (resolve) => {
      this.response$.subscribe((data) => {
        resolve(data)
      })

      this.stream.write(command + '\n')
    })
  }

  clear() {
    this.commands = []
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
            const regexEndCommand = /^.+\(.+\)\-\>/gm
            const matchEndCommand = data.toString().match(regexEndCommand)

            if (matchEndCommand) {
              const splitted = data.toString().split(regexEndCommand)
              dataBuffer += splitted[0]
              this.response$.next(dataBuffer)
              dataBuffer = splitted[1]
            } else {
              dataBuffer += data
            }
          })
          .on('end', () => {
            resolve(dataBuffer)
          })

        stream.write(this.command)
        // stream.end()
      })
    })
  }

  disconnect() {
    this.conn.end()
  }
}
