import { inject } from '@adonisjs/core'
import HtmxService from '#services/htmx_service'
import { HttpContext } from '@adonisjs/http-server'

import { generateRandomID } from '../helpers/utils.js'
import Switch from '#models/switch'
import Port from '#models/port'
import Config from '../models/config.js'
import SSH from '../services/ssh.js'
import setPortAliasServiceCmd from '../ssh/set/set_port_alias_cmd.js'
import setAdminPortStatusCmd from '../ssh/set/set_admin_port_status_cmd.js'
import showPortStatusCmd from '../ssh/show/show_port_status_cmd_cmd.js'
import showConfigCmd from '../ssh/show/show_config_cmd.js'
import showIpAddressCmd from '../ssh/show/show_ip_address_cmd.js'

@inject()
export default class SwitchesController {
  constructor(private hx: HtmxService) {}

  async all({ params }: HttpContext) {
    const switches = await Switch.all()
    return switches
  }

  async show({ params }: HttpContext) {
    const sw = await Switch.query().where('id', params.id).preload('ports').first()
    return sw
  }

  async showPortStatus({ params, response }: HttpContext) {
    const sw: any = await Switch.query().where('id', params.id).first()

    const ssh = await SSH.connect({ host: sw.ip })
    const data = await showPortStatusCmd(ssh)
    ssh.disconnect()

    return response.status(200).send(data)
  }

  async create() {
    return this.hx.render('pages/switches/create')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'ip', 'hostname', 'location', 'user', 'password'])

    try {
      const cmd = await SSH.connect({ host: data.ip })
      const vlanPorts = await showPortStatusCmd(cmd)
      cmd.disconnect()

      const sw = await Switch.create(data)

      const ports = vlanPorts.map((port: any) => {
        return {
          switchId: sw.id,
          portName: port.portName,
          alias: port.portAlias,
        }
      })
      await Port.createMany(ports)

      const swUpdated = await Switch.query().where('id', sw.id).preload('ports').first()
      return swUpdated
    } catch (error) {
      return response.status(500).send({ error: 'Error connecting to switch' })
    }
  }

  async updateVlans() {
    // console.log('atualizando' + params.id, request.body())
  }

  async updatePort({ params, request, response }: HttpContext) {
    const data = request.only(['alias', 'description', 'portName'])
    const sw = await Switch.query().where('id', params.id).first()

    if (!sw) {
      return { error: 'Switch not found' }
    }

    const ssh = await SSH.connect({ host: sw.ip })
    await setPortAliasServiceCmd(ssh, data.portName, data.alias)
    ssh.disconnect()

    await Port.query()
      .where('switchId', sw.id)
      .where('portName', data.portName)
      .update({ alias: data.alias, description: data.description })

    const ports = await Port.query().where('switchId', sw.id)
    return response.status(200).send(ports)
  }

  async vlansPage({ params }: HttpContext) {
    return this.hx.render(['pages/switches/index', 'pages/switches/vlans'], {
      id: params.id,
      generateRandomID,
    })
  }

  async togglePort({ params, response, request }: HttpContext) {
    const { id, portName } = params
    const { toggle } = request.only(['toggle'])

    const sw = await Switch.query().where('id', id).firstOrFail()

    const ssh = await SSH.connect({ host: sw.ip })
    await setAdminPortStatusCmd(ssh, portName, toggle)

    const portStatus = await showPortStatusCmd(ssh, portName)
    ssh.disconnect()

    return response.status(200).send(portStatus[0])
  }

  async syncPorts({ params }: HttpContext) {
    const swId = params.id
    const sw = await Switch.query().preload('ports').where('id', swId).firstOrFail()

    const ssh = await SSH.connect({ host: sw.ip })
    const vlanPorts = await showPortStatusCmd(ssh)
    ssh.disconnect()

    // merge port status vindo do sw com portas do banco
    const merge = vlanPorts
      .map((portSw: any): any | null => {
        const portDb = sw.ports.find((p: any) => p.portName === portSw.portName)
        if (portDb) {
          return {
            ...portDb.toJSON(),
            alias: portSw.portAlias,
          }
        }
        return null
      })
      .filter((p) => p !== null)

    const mergePromise = merge.map((port: any): any => {
      return Port.query().where('id', port.id).update(port)
    })
    await Promise.all(mergePromise)

    // apaga as portas do banco que não existem no sw (array filter)
    const portsToDelete = sw.ports.filter(
      (port: any) => !vlanPorts.find((p: any) => p.portName === port.portName)
    )
    const portsToDeletePromise = portsToDelete.map((port: any) => {
      return Port.query().where('id', port.id).delete()
    })
    await Promise.all(portsToDeletePromise)

    const ports = await Port.query().where('switchId', sw.id)
    return ports
  }

  async portsPage({ params }: HttpContext) {
    return this.hx.render(['pages/switches/index', 'pages/switches/ports'], { id: params.id })
  }

  async getConfig({ params, response }: HttpContext) {
    const sw = await Switch.query().preload('config').where('id', params.id).firstOrFail()
    return response.status(200).send(sw.config)
  }

  async getConfigAndSync({ params, response }: HttpContext) {
    const sw = await Switch.query().where('id', params.id).first()

    const ssh = await SSH.connect({ host: sw?.ip })
    const config = await showConfigCmd(ssh)
    ssh.disconnect()

    const configDB = await Config.firstOrCreate({ switchId: params.id }, { content: config })

    return response.status(200).send(configDB)
  }

  async configPage({ params }: HttpContext) {
    const ssh = await SSH.connect({
      host: '10.10.0.3',
    })
    // const vlanPort = new VlanPortCmdService(cmd)
    // const response = await vlanPort.send()

    // const portStatus = new PortStatusCmdService(cmd)
    // const response = await portStatus.send()

    // const hostVlan = new ShowHostVlanService(cmd)
    // const response = await hostVlan.send()

    const ipAddress = await showIpAddressCmd(ssh)

    // const systemInfo = new ShowSystemService(cmd)
    // const response = await systemInfo.send()

    // console.log(response)
    return ipAddress

    return this.hx.render(['pages/switches/index', 'pages/switches/config'], { id: params.id })
  }

  async backupPage({ params }: HttpContext) {
    return this.hx.render(['pages/switches/index', 'pages/switches/backup'], { id: params.id })
  }

  async test({ response }: HttpContext) {
    console.log('running test endpoint')

    const ssh = await SSH.connect({
      host: '10.10.0.107',
    })
    //-----------------
    const ipAddress = await showIpAddressCmd(ssh)

    //-----------------
    console.log('fechando a conexao')
    ssh.disconnect()
    return response.status(200).send({ ipAddress })
  }
}
