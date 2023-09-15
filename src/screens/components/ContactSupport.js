import React, { useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { WalletSuccessSVGComponent } from '../../assets/svgs/components'
import Button from '../../components/Button'
import CheckBox from '../../components/CheckBox'
import CustomText from '../../components/CustomText'
import CustomTextInput from '../../components/CustomTextInput'
import Loading from '../../components/Loading'
import CustomModal from '../../components/Modal'
import ScreenContainer from '../../components/Screen'
import FlashNotification from '../../components/common/FlashNotification'
import { useContactSupport } from '../../hooks'
import LogStore from '../../stores/LogStore'
import { themeColors } from '../../config/colors'
import CustomTextInputArea from '../../components/TextAreaInput'
import Spacer from '../../components/Spacer'



const ContactSupport = (props) => {

    const [descriptionWordsLength, setDescriptionLength] = useState(10)
    const [loaderValue, setLoaderValue] = useState("")
    const [logs, setLogs] = useState(true);
    const { sendMessage } = useContactSupport()
    const modalRef = useRef(null)

    const [data, setData] = useState({

        email: {
            value: "",
            errors: [],
        },
        description: {
            value: "",
            errors: [],
            success: []

        },

    });

    const isValidated =
        data?.email?.value?.length &&
        data?.description?.value?.length

    const handleSendMessage = () => {
        const isLogs = logs ? LogStore.getLogData()._array : []
        setLoaderValue("Sending Message")
        sendMessage(data, isLogs).then((res) => {

            setLoaderValue("")
            modalRef.current(true)

        }).catch(error => {
            setLoaderValue("")
            FlashNotification.show(`${error?.response?.data?.description}: ${error?.response?.data?.errors[0]?.message}`)

        })

    }

    const handleInput = (t, tag) => {

        setData((prevState) => {
            const valueToSet = { value: "" };
            if (tag === "email") {
                valueToSet.value = t;
                if (t.match(/.@.*\.../)) {
                    valueToSet.value = t;

                } else {
                    valueToSet.success = [];
                    valueToSet.errors = [
                        "Enter Valid Email",
                    ];
                }
            }

            if (tag === "description") {

                if (t.length < 10 || t.length > 1000) {
                    valueToSet.errors = [
                        "Description must be between 10 to 1000 words",
                    ];
                } else {
                    valueToSet.value = t;
                    valueToSet.errors = [];
                    valueToSet.success = ["Looks Good"]
                }
            }

            return {
                ...prevState,
                [tag]: valueToSet,
            };
        });
    };

    const handleDone = () => {

        modalRef.current(false)
        props.navigation.goBack()
    }



    return (
        <ScreenContainer headerTitle='Contact Support'>

            {loaderValue && <Loading label={loaderValue} />}

            <CustomTextInput
                label={"Email"}
                placeholder={"typehere@example.com"}
                onChangeText={(t) => handleInput(t, 'email')}
                errors={data?.email?.errors}
                autoCapitalize={'none'}
            />

            <Spacer height={20} />
            <CustomTextInputArea
                label={"Description"}
                placeholder={"type here..."}
                onChangeText={(t) => {
                    setDescriptionLength(t.length)
                    handleInput(t, 'description')
                }}
                multiline={true}
                maxLength={1000}
                errors={data?.description?.errors}
                success={data?.description?.success}

            />



            <View style={styles.descriptionWords}>
                <CustomText body2>{`(${descriptionWordsLength}/1000)`}</CustomText>
            </View>


            <View style={styles.checkBoxView}>
                <CheckBox
                    checked={logs}
                    label={"Attach Diagnostic Data"}
                    onPress={() => {
                        setLogs(!logs)
                        handleInput("", "logs")

                    }}
                />


                <CustomText body style={{ paddingLeft: 12 }}>
                    The attached data does NOT contain any private keys and contains NO secret information (e.g., your wallet password or recovery phrase). The data contains basic state information about your wallet and accounts, and is by default, included in your support request to help us debug any issues you might be having with your wallet app.
                </CustomText>
            </View>


            <View style={styles.btnView}>
                <Button disabled={!isValidated} label={'Send Message'} onPress={handleSendMessage} />
            </View>

            <CustomModal bridge={modalRef}>
                <View style={styles.modal}>
                    <WalletSuccessSVGComponent />
                    <CustomText titiliumSemiBold body style={{ textAlign: 'center' }}>
                        Your message was sent.
                        Thank you for contacting support
                    </CustomText>
                </View>
                <Button label={"Done"} onPress={handleDone} />
            </CustomModal>


        </ScreenContainer>
    )
}

export default ContactSupport

const styles = StyleSheet.create({


    textAreaContainer: {

        borderWidth: 1,
        borderRadius: 20,
        height: 100


    },


    inputContainer: {
        borderRadius: 16,
        height: Dimensions.get('window').height * 0.2,
        // paddingTop: 10
        paddingTop: 10,
        textAlignVertical: 'top',

    },
    descriptionWords: {
        alignItems: 'flex-end'
    },

    checkBoxView: {

        alignItems: 'flex-start',
    },
    btnView: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modal: {
        alignItems: "center",
        marginVertical: 20,
    },

})