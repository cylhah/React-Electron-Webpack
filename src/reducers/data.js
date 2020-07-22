export const initData = () => {
    return {
        count: 1
    };
}
function data(state = initData(), action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default data;