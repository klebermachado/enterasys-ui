require 'net/ssh'

# Definindo as credenciais e detalhes do dispositivo
host = '10.10.10.10'        # IP do switch
username = 'user'    # Usuário
password = ''          # Senha
port = 22                   # Porta SSH, 22 por padrão

Net::SSH.start(host, username, password: password, port: port, verify_host_key: :never) do |ssh|
  ssh.open_channel do |channel|
    channel.on_data do |ch, data|
      puts data  # Imprime a saída recebida do dispositivo
    end

    channel.on_extended_data do |ch, type, data|
      puts "STDERR: #{data}"
    end

    channel.request_pty do |ch, success|
      raise "Could not obtain pty (i.e., interactive shell)" if not success
      
      ch.send_channel_request('shell') do |ch, success|
        raise "Could not open shell" unless success

        ch.send_data("show vlan port\n")
        ch.send_data("exit\n")  # Envia 'exit' para sair da sessão interativa, se necessário
      end
    end

    channel.on_close do
      puts "Channel is closing!"
    end
  end.wait
end
