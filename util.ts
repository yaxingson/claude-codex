import readline from 'node:readline/promises'

export const input = async (prompt:string) => {
  const r1 = readline.createInterface({
    input:process.stdin,
    output: process.stdout
  })

  const content = await r1.question(prompt)
  r1.close()
  return content
}

