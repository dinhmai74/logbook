import { GluegunToolbox } from 'gluegun'

// actions.js constant.js reducer.js

export const description = 'Generates redux + actions + constant'
export const alias = 'r'
export const run = async function(toolbox: GluegunToolbox) {
  // grab some features
  const { parameters, print, strings, filesystem, patching } = toolbox
  const { isBlank, snakeCase, camelCase } = strings

  // validation
  if (isBlank(parameters.first)) {
    print.info('A constant is required.')
    return
  }

  if (isBlank(parameters.second)) {
    print.info('A actions is required.')
    return
  }

  const constantName = parameters.first
  const actionName = parameters.second
  // PascalName
  const constantNameFinal = snakeCase(constantName).toUpperCase()
  const actionNameFinal = camelCase(actionName)
  // camelName
  // const camelName = camelCase(constantName)

  // const props = {}
  // const jobs = []

  // for (let i = 0; i < jobs.length; i++) {
  // let e = jobs[i]
  // await generate({
  // template: e.template,
  // target: e.target,
  // props: props
  // })

  // print.info('Created file ' + e.target)
  // }

  const barrelsEndFiles = []
  const barrelsImport = []

  const baseURL = `LOGBOOK`

  barrelsEndFiles.push({
    path: `${process.cwd()}/constants.js`,
    template: `export const ${constantNameFinal} = '${baseURL}/${constantNameFinal}'`
  })

  barrelsEndFiles.push({
    path: `${process.cwd()}/actions.js`,
    template: `export const ${actionNameFinal} = payload => ({
\ttype: ${constantNameFinal},
\tpayload,
})`
  })

  barrelsImport.push({
    path: `${process.cwd()}/actions.js`,
    template: `import { ${constantNameFinal} } from './constants'\n`
  })

  for (let i = 0; i < barrelsEndFiles.length; i++) {
    const barrel = barrelsEndFiles[i]
    const barrelExportPath = barrel.path
    const template = barrel.template
    if (!filesystem.exists(barrelExportPath)) {
      const msg =
        `No '${barrelExportPath}' file found. Can't export component.` +
        `Export your new component manually.`
      print.warning(msg)
      process.exit(1)
    } else await patching.append(barrelExportPath, template)
  }

  for (let i = 0; i < barrelsImport.length; i++) {
    const barrel = barrelsImport[i]
    const barrelExportPath = barrel.path
    const template = barrel.template
    if (!filesystem.exists(barrelExportPath)) {
      const msg =
        `No '${barrelExportPath}' file found. Can't export component.` +
        `Export your new component manually.`
      print.warning(msg)
      process.exit(1)
    } else await patching.prepend(barrelExportPath, template)
  }

  // import const
  // const actionsPaths= `${process.cwd()}/actions.js`

  // if (!filesystem.exists(actionsPaths)) {
  // const msg =
  // `No '${actionsPaths}' file found.  Can't insert screen.` +
  // `Something went wrong with the navigator generator.`
  // print.error(msg)
  // process.exit(1)
  // }

  // const constantsImport = constantNameFinal + "\n"
  // await patching.patch(navFilePath, {
  // before: new RegExp(Patterns.NAV_IMPORTS_SCREENS),
  // insert: `  ${constantsImport},\n`
  // })

  // const navigatorImports = pascalNavigators.map(pascalNavigator => {
  // const kebabNavigator = kebabCase(pascalNavigator)
  // return `\nimport { ${pascalNavigator} } from "./${kebabNavigator}"`
  // })

  // const toImport = navigatorImports.join('')

  // await patching.patch(navFilePath, {
  // after: new RegExp(Patterns.NAV_IMPORTS_NAVIGATORS),
  // insert: toImport
  // })

  // // insert routes
  // const routes = [...pascalScreens, ...pascalNavigators]
  // .map(pascalItem => {
  // const camelItem = camelCase(pascalItem)
  // return `\n  ${camelItem
  // .replace('Screen', '')
  // .replace('Navigator', '')}: { screen: ${pascalItem} },`
  // })
  // .join('')

  // await patching.patch(navFilePath, {
  // after: new RegExp(Patterns.NAV_ROUTES),
  // insert: routes
  // })
}
