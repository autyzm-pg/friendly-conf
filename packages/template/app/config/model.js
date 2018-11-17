// @flow
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