import { Client } from 'ssh2'

export const config = {
  runtime: 'edge',
  /**
   * https://vercel.com/docs/concepts/edge-network/regions#region-list
   * disable hongkong
   * only for vercel
   */
  regions: [
    'hkg1',
    'sin1',
    'kix1',
    'icn1',
    'bom1',
    'hnd1',
    'arn1',
    'bru1',
    'cdg1',
    'cle1',
    'cpt1a',
    'dub1',
    'fra1',
    'gru1',
    'iad1',
    'lhr1',
    'pdx1',
    'sfo1',
    'syd1'
  ]
}

export async function GET () {
  try {
    const data = await executeCommand({
      host: import.meta.env.SSH_HOST,
      port: import.meta.env.SSH_PORT,
      username: import.meta.env.SSH_USERNAME,
      password: import.meta.env.SSH_PASSWORD,
      readyTimeout: 999999,
      tryKeyboard: true
    })
    const server = (
      await fetch(`http://www.pushplus.plus/send`, {
        method: 'POST',
        body: JSON.stringify({
          token: import.meta.env.SENDKEY,
          title: '自动续期ok',
          channel: 'wechat',
          content: data
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json()
    return new Response(data, { status: 200 })
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}

async function executeCommand (connOptions) {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn
      .on('ready', () => {
        console.log('Client :: ready')
        conn.exec('date', (err, stream) => {
          if (err) {
            conn.end()
            return reject(err)
          }

          stream
            .on('close', () => {
              conn.end()
            })
            .on('data', data => {
              console.log('执行date命令输出: \n' + data)
              resolve('执行date命令输出: \n' + data)
            })
            .stderr.on('data', data => {
              reject('错误信息: ' + data)
            })
        })
      })
      .on(
        'keyboard-interactive',
        (name, instructions, instructionsLang, prompts, finish) => {
          finish([import.meta.env.SSH_PASSWORD])
        }
      )
      .on('error', err => {
        reject(err)
      })
      .connect(connOptions)
  })
}
