const axios = require("axios");

const OAUTH_URL = require("../config").OAUTH_URL;

const GetLocationInfo = {
    getLocations: async(provinceId, districtId, cityId) => {
        // location url
        const location_url = `${OAUTH_URL}/get/address?province_id=${provinceId}&district_id=${districtId}&city_id=${cityId}`;

        return await axios.get(location_url)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                if (err.response.status === 422)
                    return {
                        status: 422,
                        message: "Unprocessable Entity"
                    }
                
                return err.response.data;
            })
    }
};

module.exports = GetLocationInfo;