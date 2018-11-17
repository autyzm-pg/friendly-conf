import React from "react"

import {
    Body,
    Button as NativeBaseButton,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Icon,
    Left,
    Right,
    Tab,
    TabHeading,
    Tabs,
    Text,
    Title,
    View
} from 'native-base'

import {connect} from "react-redux"
import {ModeTypes} from "../db/format"
import * as R from "ramda"
import styles from "./mainPageStyles"
import {withStyle} from "../libs/withStyle"

const buttonStyles = {
    height: 60,
    marginBottom: 5,
}
const Button = withStyle(buttonStyles)(NativeBaseButton)

const StatusContainer = withStyle({
    flexDirection: "row",
    justifyContent: "space-between"
})(View)

const MainPage = ({history, location, activeConfig, hasAnyConfig}) => (
    <Container>
        <Header>
            <Body>
            <Title>{{app_label}}</Title>
            </Body>
        </Header>
        <View style={styles.content}>
            <View style={styles.buttonsContainer}>
                <StatusContainer>
                    <Text>Aktywna konfiguracja: </Text>
                    {
                        hasAnyConfig ? (
                            <Text>
                                {activeConfig.name} ({activeConfig.mode === ModeTypes.learning ? "uczenie" : "test"})
                            </Text>
                        ) : <Text>Brak</Text>
                    }

                </StatusContainer>
                <View>
                    <Button block light onPress={() => {
                        history.push("/configurations")
                    }}>
                        <Text>Konfiguracje</Text>
                    </Button>
                </View>
                {/*<Button full light onPress={() => Linking.openURL("expd16bca44a7e84f759fcce334a17cc6ea://")}>*/}
                {/*<Text>Przejdź do aplikacji</Text>*/}
                {/*<Icon name="arrow-round-forward"/>*/}
                {/*</Button>*/}
            </View>
        </View>
    </Container>
)

const stateToProps = ({configurations}) => ({
    activeConfig: {
        id: configurations.active.id,
        mode: configurations.active.mode,
        name: R.propOr('Brak', "name", configurations.all.find(config => config.id === configurations.active.id))
    },
    hasAnyConfig: configurations.all.length > 0
})

export default connect(stateToProps)(MainPage)