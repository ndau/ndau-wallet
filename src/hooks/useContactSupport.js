import axios from "axios"
import AppConfig from "../AppConfig"
import FlashNotification from "../components/common/FlashNotification"


export default useContactSupport = () => {

    const sendMessage = (data, isLogs) => {

        console.log(data,isLogs,'data=======')

        const sendMessage = axios.create({
            headers: { 'x-api-key': AppConfig.FRESHDESK_INTEGRATION_API_KEY }
        })
        return new Promise((resolve, reject) => {
            try {
                sendMessage.post(AppConfig.FRESHDESK_TICKET_ENDPOINT, {
                    email: data.email.value,
                    description: data.description.value,
                    logs: isLogs
                })
                    .then(response => {

                        resolve(response.data)

                        LogStore.log('support message sent')
                    })
                    .catch(error => {
                        reject(error)
                        // LogStore.log(error)
                    })
            } catch (error) {

            }
        
        })

    }


    return {

        sendMessage

    }
}