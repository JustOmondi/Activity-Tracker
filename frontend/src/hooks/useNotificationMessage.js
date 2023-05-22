import { message } from 'antd';
import { NOTIFICATION_DURATION_SECONDS } from '../Config';

const useNotificationMessage = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = (type, message) => {
        messageApi.destroy()

        const duration = type === 'loading' ? 0 : NOTIFICATION_DURATION_SECONDS

        messageApi.open({
            type: type,
            content: message,
            duration: duration,
        });
    }

    const hideMessage = () => {
        messageApi.destroy()
    }

    return {
        contextHolder,
        hideMessage,
        showMessage
    }
}

export default useNotificationMessage