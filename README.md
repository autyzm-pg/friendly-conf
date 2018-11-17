# Friendly Confy
Framework for creating manager applications for Friendly Apps - applications family for children with autism.

## Instructions

- [Create an app](packages/create-confy-app/README.md) - how to create a new confy app
- Edit the [app/config/models.js](packages/template/app/config/models.js) file to define configuration's scheme for your app
- Edit the [app/config/view.js](packages/template/app/config/view.js) file to define the configuration's wizard view
- Build, run and test your application
- When you are ready to publish the app, build it with Android Studio or appcenter.ms

## Users data

All configurations users create are stored in JSON format in device's memory external storage in directory with your app's name given during app creation:
```
{external_storage}/{app_name}/db.json
```
For example:
```
/storage/emulated/0/friendly-words-app/db.json
```
The database's JSON has the following structure:
```javascript
{
    "activeConfig": {
        "id": <id of currently active config>,
        "mode": 0 | 1 // 0 is for learning mode, 1 is for testing mode
    },
    "tables": {
        "configs": [ // list of user's configurations
            "id": <config id>,
            "name": <config name>,
            "config": { // json's object with the shape specified in model.js file
                ...
            },
            ...
        ]
    }
}
```

## Creating a model
To create a custom configuration's model, edit the `app/config/model.js` file. Example of a model:
```javascript
import {MainModel} from "../libs/confy/models"
import {OptionField} from "../libs/confy/fields/options/optionField"
import {TextField} from "../libs/confy/fields/text/textField"
import {IntegerField} from "../libs/confy/fields/integer/IntegerField"

export const ConfigurationModel = MainModel({
    someTextField: TextField("Jakies pole tekstowe", {def: "domyslna wartosc"}),
    optionField: OptionField("Pole z opcjami", {
        options: [
            "Opcja 1",
            "Opcja 2",
        ]
    }),
    integerField: IntegerField("Pole liczbowe", {def: 3, min: 1, max: 5}),
})
```

The model will be used by the Friendly Confy framework to create controls for fields specified by a developer.  Each field has it's own UI component that will be rendered. Developer can create custom UI components for fields as well as custom fields. All fields that are supposed to be accessible for a user, should be used inside the `view.js` file.

## Customizing wizard's view

In order to create a UI for the wizard, which will be used by end users in order to create new configurations, you should edit the `app/config/view.js` file.

```javascript
import {ConfigurationModel} from "./model"
import {WizardStep, WizardView} from "../libs/confy/views/wizard/wizardView"
import {Column, ColumnView} from "../libs/confy/views/column/columnView"
import {ListView} from "../libs/confy/views/list/listView"

export const ConfigurationWizardView = WizardView(fields => [
    WizardStep("Krok 1", ColumnView([
        Column([fields.integerField]),
        Column([fields.optionField])
    ])),
    WizardStep("Krok 2", ListView([fields.someTextField])),
], ConfigurationModel)
```

The file should have a named export `ConfigurationWizardView` which should be an instance of the `WizardView`. The constructor of the `WizardView` takes a function, which should return a list of wizard's steps, where each step is an instance of the `WizardStep`. The function as a parameter takes the `field` object, which has exactly the same shape, as the model object passed to the `WizardView` as a second parameter.

`WizardStep`'s constructor also takes 2 arguments. First argument is the step's name, which will be shown in the wizard's tab panel. It also has to be unique. The second argument is the step's view. There are many different views available, but the developer can create his own views to render step's data. Usually, a view takes a list of fields that should be rendered inside it.

## Model fields
There are following fields available for developer:
- TextField
- BoolField
- OptionField
- MultiChooserField
- ImageMultiChooserField
- IntegerField
- ImagePickerField
- ArrayField
- ObjectField

Each field has it's own set of arguments suitable only for it. If there is no field that fulfils developer's requirements, a new field can be created using the `Field` constructor.

## Wizard step's views

There are following wizard step's views:
- ColumnView
- ListView
- SectionView
- SingleView

Each view has it's own set of arguments and a way of initialization suitable only for it. If there is no view that fulfils developer's requirements, a new view can be created.

## Creating custom fields
TODO

## Creating custom views
TODO

## Connecting to MS Appcenter services
TODO

## Improvements
- more thorough documentation
- separate all confy's files as a library - allow developers to create their own applications and use the confy as a simple library
