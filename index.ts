import { getRepoInfo } from './api'
import { input } from './util'

async function main(argv:string[]) {
  const repoUrl = argv[argv.length-1]
  const [_, owner, repo] = /\.com\/(.+)\/(.+)\.git$/.exec(repoUrl)!
  const repoInfo = await getRepoInfo(owner, repo)

  while (true) {
    const userInput = await input('>>> ')

    if (userInput === 'exit') { break }

  }
}

main(process.argv)
