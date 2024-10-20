import { v4 as uuid } from 'uuid';

function getUniqueId() {
    return uuid();
}

export {
    getUniqueId,
}