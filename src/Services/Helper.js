
const getErrorMessage = (response, showError = true) => {

    let message = '';
    if (response.data) {
        if (typeof response.data.error === 'object' && response.data.error.message) {
            message = response.data.error.message;
        } else if (response.data.message) {
            message = response.data.message;
        } else if (response.data.error) {
            message = response.data.error;
        } else {
            message = getMessage(response.problem)
        }
    } else {
        message = getMessage(response.problem)
    }
    if (showError) {
        console.log(message);
    }
    if (response.status === 401) {

    }


    return message





};

const getMessage = (error) => {
    if (error === 'TIMEOUT_ERROR') {
        return 'noResponseServer'
    } else if (error === 'CONNECTION_ERROR') {
        return 'serverNotAvailable'
    } else if (error === 'NETWORK_ERROR') {
        return 'networkNotAvailable'
    } else {
        return 'somethingWrongTryAgain'
    }
};


const gen4 = () => {
    return Math.random().toString(16).slice(-4);
};

const simpleUniqueId = (prefix) => {
    return (prefix || "").concat(
        [gen4(), gen4(), gen4(), gen4()].join("")
    );
};

const capitalize = (str) => {
    const newStr = str.charAt(0).toUpperCase() + str.slice(1);
    return newStr;
}

export default {
    getErrorMessage,
    simpleUniqueId,
    capitalize
}
