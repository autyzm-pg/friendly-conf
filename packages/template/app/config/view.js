// @flow
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