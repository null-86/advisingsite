import { SERVER_ROOT } from './constants';

const getAllClasses = async () => {

    let results = await fetch(SERVER_ROOT + '/api/getAllClasses/')
        .then((response) => response.json());
}

export default getAllClasses;