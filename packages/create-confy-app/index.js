// const replace = require("replace-in-file")
const {always} = require("ramda")
const readline = require('readline')
const download = require('download')
const fs = require("fs-extra")
const replace = require('replace-in-file')
const glob = require("glob")
const path = require('path')
const program = require('commander')

program
    .option('-t, --template <path>', 'Path to template to use instead of the remote repository')
    .parse(process.argv)

let isBeingKilled = false;
process.on('exit', () => {
    if(!isBeingKilled) {
        isBeingKilled = true;
        fs.remove("./.temp").then(() => process.exit(0))
    }
})

const version = "1.0.0"
const url = `https://github.com/autyzm-pg/friendly-confy/archive/v${version}.zip`
const directoryName = `friendly-confy-${version}`

const appNameValidator = value => /^\w+$/.test(value)
const appNameLowerCaseCreator = variables => Promise.resolve(variables.find(v => v.variable === "app_name").value.toLowerCase())

const trim = x => x.trim()

const setupVariables = [
    {
        variable: "app_name",
        question: "Project name (only alphanumerics)",
        validator: appNameValidator,
        errorHint: "error: value must be alphanumeric"
    },
    {variable: "app_name_lowercase", creator: appNameLowerCaseCreator},
    {variable: "app_label", question: "App label (visible in Google Play)"},
]


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const defaultValidator = () => true
const defaultCreator = (allVariables, {variable, question, validator = defaultValidator, errorHint = "error: try again", processor = trim}) =>
    new Promise((resolve, reject) => {
        (function ask() {
            rl.question(`${question}: `, value => validator(value) ? resolve(processor(value)) : console.log(errorHint) || ask())
        })()
    })

const createdVariablesPromises = setupVariables.reduce((allVariablePromises, variable) => [
    ...allVariablePromises,
    Promise.all(allVariablePromises)
        .then(allVariables => (variable.creator || defaultCreator)(allVariables, variable))
        .then(value => ({
            ...variable,
            value
        }))
], [])

const prepareFiles = () => download(url, '.temp', {extract: true, filename: "confy"})
    .catch(err => {
        console.error("Could not download the template", err)
        throw err
    })

const prepareFilesFromPath = () => fs.copy(program.template, `.temp/${directoryName}/packages/template`)
    .then(() => console.log("tesast"))
    .catch(err => {
        console.error("Could not copy the template", err)
        throw err
    })

;(program.template ? prepareFilesFromPath : prepareFiles)()
    .then(() => Promise.all(createdVariablesPromises))
    .then(variables => {
        rl.close()
        return Promise.resolve(variables.reduce((allVariables, v) => ({
            ...allVariables,
            [v.variable]: {...v}
        }), {}))
    })
    .then(variables => fs.pathExists(`./${variables['app_name'].value}`)
        .then(exists => {
            if (exists) {
                throw `The project '${variables['app_name'].value}' already exists.`
            }
        })
        .then(() => variables))
    .then(variables => fs.move(`./.temp/${directoryName}/packages/template`, `./${variables['app_name'].value}`)
        .then(always(variables)))
    .then(async variables => {
        Object.values(variables).forEach(v => replace.sync({
            files: `./${variables['app_name'].value}/**/*`,
            from: new RegExp(`{{${v.variable}}}`, 'g'),
            to: v.value,
        }))

        await Promise.all(
            Object.values(variables).map(v => new Promise((resolve, reject) => glob(`./${variables['app_name'].value}/**/{{${v.variable}}}`, (err, files) => {
                if (err) {
                    reject(err)
                }
                else {
                    files.forEach(file => fs.moveSync(file, path.join(path.dirname(file), v.value)))
                    resolve()
                }
                reject("Unexpected error")
            })))
        )
    })
    .then(() => console.log('done'))
    .catch(err => console.error("Could not create the project.", err))
    .then(() => fs.remove("./.temp"))