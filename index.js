require('dotenv').config()

const { Client } = require('ssh2')

const conn = new Client()
conn.on('ready', () => {
	console.log('Client :: ready')
	conn.exec('show port', (err, stream) => {
		if (err) throw err
		stream
			.on('close', (code, signal) => {
				console.log('Stream :: close :: code: ' + code + ', signal: ' + signal)
				conn.end()
			})
			.on('data', (data) => {
				console.log('STDOUT: ' + data)
			})
			.stderr.on('data', (data) => {
				console.log('STDERR: ' + data)
			})
	})
}).connect({
	host: process.env.SW_HOST,
	port: process.env.SW_PORT,
	username: process.env.SW_USER,
	password: process.env.SW_PASSWORD,
	debug: console.log,
	// https://stackoverflow.com/questions/41724475/ssh2-node-js-sftp-protocol-error-handshake-failed
	algorithms: {
		kex: [
			'diffie-hellman-group14-sha1',
			// "ecdh-sha2-nistp256",
			// "ecdh-sha2-nistp384",
			// "ecdh-sha2-nistp521",
			// "diffie-hellman-group-exchange-sha256",
			// "diffie-hellman-group14-sha1"
		],
		cipher: [
			// 	"3des-cbc",
			// 	"aes128-ctr",
			// 	"aes192-ctr",
			// 	"aes256-ctr",
			// 	"aes128-gcm",
			// 	"aes128-gcm@openssh.com",
			// 	"aes256-gcm",
			// 	"aes256-gcm@openssh.com"
		],
		serverHostKey: [
			'ssh-dss',
			'ssh-rsa',
			// "ecdsa-sha2-nistp256",
			// "ecdsa-sha2-nistp384",
			// "ecdsa-sha2-nistp521"
		],
	}
})