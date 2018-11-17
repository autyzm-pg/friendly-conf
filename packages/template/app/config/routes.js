import React from "react"
import {NativeRouter, Route, Switch, withRouter} from "react-router-native"
import MainPage from "../pages/MainPage"
import CreatorPage from "../pages/CreatorPage"
import ConfigurationsPage from "../pages/ConfigurationsPage"
import {EditPage} from "../pages/EditPage"
import {View} from "native-base"
import {BackHandler} from "react-native"


// const WordLabel = ({item}) => (
//     <View>
//         <Text>{item.name}</Text>
//     </View>
// )
//
// const createResourcePages = (model, WizardView, listPageTitle, ListElementComponent, toString) => {
//     const ResourcePage = EnhancedResourcesPage(model.name, listPageTitle, ListElementComponent, toString)
//     const WizardPage = EnhancedResourceCreatorPage(model.name, WizardView)
//     const EditPage = EnhancedResourceEditPage(model.name, WizardView)
//
//     return [
//         {path: `/resources/${model.name}`, component: ResourcePage},
//         {path: `/creator/resource/${model.name}/:id`, component: EditPage},
//         {path: `/creator/resource/${model.name}`, component: WizardPage}
//     ]
// }
// const SomeResourceRoutes = createResourcePages(WordModel, WordsWizardView, "Zasoby", WordLabel, res => res.name)
const SomeResourceRoutes = []

const BackButtonHandler = withRouter(class BackButtonHandler extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.history.index > 0) {
                this.props.history.goBack()
                return true
            }
            return false
        })
    }

    render() {
        return this.props.children
    }
})

export default Router = () =>
    <NativeRouter>
        <BackButtonHandler>
            <Switch>
                {SomeResourceRoutes.map((props, i) => <Route {...props} key={i}/>)}
                <Route exact path="/" component={MainPage}/>
                <Route path="/configurations" component={ConfigurationsPage}/>
                <Route path="/creator/:id" component={EditPage}/>
                <Route path="/creator" component={CreatorPage}/>
            </Switch>
        </BackButtonHandler>
    </NativeRouter>