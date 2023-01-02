import fs from 'fs'

let dirName = '../../Awecode/Staffin/staffin-frontend-v2/pages'

let localizationJson = {}

function readFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((file) => {
      fs.stat(`${dir}/${file}`, (err, stats) => {
        if (err) {
          console.error(err)
          return
        }
        if (stats.isFile()) {
          fs.readFile(`${dir}/${file}`, 'utf8', (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            const templateRegex = /<template>([\s\S]+?)<\/template>/g
            const templateMatch = data.match(templateRegex)
            const regex = /<([a-z][a-z0-9]*)\b[^>]*>([^<]*)<\/\1>/g
            let matches = templateMatch[0].match(regex)
            const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
            if (!matches) return
            matches = matches.map((match) => {
              match = match.replace(htmlRegex, '')
              return match
            })
            const excludingDoubleBracketRegex = /[^\{\}]+(?=\{\{|$)/g
            matches.forEach((match) => {
              match = match.trim()
              const texts = match.match(excludingDoubleBracketRegex)
              if (!texts) return
              texts.forEach((text) => {
                if (text.match(/^[^\w\d]*$/g)) return
                text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ')
                if (!localizationJson[text]) localizationJson[text] = text
              })
            })
          })
        } else if (stats.isDirectory()) {
          readFiles(`${dir}/${file}`)
        }
      })
    })
  })
}

readFiles(dirName)

dirName = '../../Awecode/Staffin/staffin-frontend-v2/components'

readFiles(dirName)

dirName = '../../Awecode/Staffin/staffin-frontend-v2/layouts'

readFiles(dirName)

setTimeout(() => {
  fs.writeFile('localization.json', JSON.stringify(localizationJson), (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('File has been created')
  })
}, 1000)
