// const replace = require("replace-in-file")
const readline = require('readline')
const unzip = require('unzip')
const download = require('download-file')
const fs = require("fs-extra")

const version = "v0.0.0"
const url = `https://github.com/autyzm-pg/friendly-confy/archive/${version}.zip`

const appNameValidator = value => value !== "a"
const appNameLowerCaseCreator = variables => Promise.resolve(variables.find(v => v.variable === "app_name").value.toLowerCase())

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
const defaultCreator = (allVariables, {variable, question, validator = defaultValidator, errorHint = "error: try again"}) =>
    new Promise((resolve, reject) => {
        (function ask() {
            rl.question(`${question}: `, value => validator(value) ? resolve(value) : console.log(errorHint) || ask())
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

Promise.all(createdVariablesPromises)
    .then(variables => {
        rl.close()
        return Promise.resolve(variables.reduce((allVariables, v) => ({
            ...allVariables,
            [v.variable]: {...variable}
        }), {}))
    })
    .then(variables => new Promise(resolve => {
        download(url, {
            directory: "./.temp",
            filename: "confy.zip"
        }, () => resolve(variables))
    }))
    .then(variables => new Promise(resolve =>
        fs.createReadStream('./temp/confy.zip')
            .pipe(unzip.Extract({path: './temp/confy'}))
            .on('close', () => resolve(variables)))
    )
    .then(variables => new Promise(resolve =>
        fs.rename("./temp/confy/packages/template", `./${variables['app_name']}`, () => resolve(variables))
    ))

