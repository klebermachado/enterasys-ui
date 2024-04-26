import { inject } from '@adonisjs/core'
import HtmxService from '#services/htmx_service'
import { HttpContext } from '@adonisjs/http-server'

import { generateRandomID } from './../helpers/utils.ts'
import CommandSshService from '../services/command_ssh_service.ts'
import PortStatusCmdService from '../services/parse/port_status_cmd_service.ts'
import VlanPortCmdService from '../services/parse/vlan_port_cmd_service.ts'
import ShowHostVlanService from '../services/parse/show_host_vlan_service.ts'
import ShowIpAddressService from '../services/parse/show_ip_address_service.ts'
import ShowSystemService from '../services/parse/show_system_service.ts'
import Switch from '#models/switch'
import Port from '#models/port'
import SetPortAliasService from '../services/parse/set_port_alias_service.js'

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
    const conn = new CommandSshService({
      host: sw.ip,
    })

    const portStatus = new PortStatusCmdService(conn)
    const data = await portStatus.send()
    return response.status(200).send(data)
  }

  async create() {
    return this.hx.render('pages/switches/create')
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name', 'ip', 'hostname', 'location', 'user', 'password'])

    const cmd = new CommandSshService({
      host: data.ip,
    })

    const vlanPort = new PortStatusCmdService(cmd)
    const response = await vlanPort.send()

    const sw = await Switch.create(data)

    const ports = response.map((port: any) => {
      return {
        switchId: sw.id,
        portName: port.portName,
        alias: port.portAlias,
      }
    })
    await Port.createMany(ports)

    const swUpdated = await Switch.query().where('id', sw.id).preload('ports').first()
    return swUpdated
  }

  async updateVlans({ params, request }: HttpContext) {
    // console.log('atualizando' + params.id, request.body())
  }

  async updatePort({ params, request, response }: HttpContext) {
    const data = request.only(['alias', 'description', 'portName'])
    const sw = await Switch.query().where('id', params.id).first()

    if (!sw) {
      return { error: 'Switch not found' }
    }

    const cmd = new CommandSshService({
      host: sw.ip,
    })
    const portAlias = new SetPortAliasService(cmd)
    await portAlias.send(data.portName, data.alias)

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

  async portsPage({ params }: HttpContext) {
    return this.hx.render(['pages/switches/index', 'pages/switches/ports'], { id: params.id })
  }

  async configPage({ params }: HttpContext) {
    const cmd = new CommandSshService({
      host: '10.10.0.3',
    })
    // const vlanPort = new VlanPortCmdService(cmd)
    // const response = await vlanPort.send()

    // const portStatus = new PortStatusCmdService(cmd)
    // const response = await portStatus.send()

    // const hostVlan = new ShowHostVlanService(cmd)
    // const response = await hostVlan.send()

    // const ipAddress = new ShowIpAddressService(cmd)
    // const response = await ipAddress.send()

    // const systemInfo = new ShowSystemService(cmd)
    // const response = await systemInfo.send()

    // console.log(response)

    return this.hx.render(['pages/switches/index', 'pages/switches/config'], { id: params.id })
  }

  async backupPage({ params }: HttpContext) {
    return this.hx.render(['pages/switches/index', 'pages/switches/backup'], { id: params.id })
  }
}
