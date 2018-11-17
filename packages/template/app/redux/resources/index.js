
import {createResourcesReducerFromModels} from "./reducers"
import {createResourceInitializerFromModel} from "./initializers"

import CombinedResourcesEpic from "./epics"

export const ResourcesReducer = createResourcesReducerFromModels([])
export const ResourcesInitializers = [
]
export const ResourcesEpic = CombinedResourcesEpic