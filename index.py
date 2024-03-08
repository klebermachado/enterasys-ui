from netmiko import ConnectHandler

# Definindo as credenciais e detalhes do dispositivo
enterasys_device = {
    'device_type': 'enterasys',  # Tipo do dispositivo
    'host': '10.10.10.10',       # IP do switch
    'username': 'user',   # Usuário
    'password': '',     # Senha
    'port': 22,                  # Porta SSH, 22 por padrão
}

# Estabelecendo a conexão
with ConnectHandler(**enterasys_device) as conn:
    # Enviando um comando
    output = conn.send_command('show vlan port')
    print(output)

    # Enviando múltiplos comandos
    # commands = ['config vlan "VLAN10" add ports 1-10 tagged', 
    #             'config vlan "VLAN20" add ports 11-20 untagged']
    # for cmd in commands:
    #     output = conn.send_config_set(cmd)
    #     print(output)

    # Salvando a configuração
    # conn.send_command('save configuration')

    print("Configuração aplicada com sucesso!")