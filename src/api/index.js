const BASE_URL =
  'https://42807e1f-07ba-4fb0-a6d2-ecc7b41dd143-prod.e1-us-east-azure.choreoapis.dev';

export function initiatePhoneVerify(userId, email, mobile, httpRequest) {
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/scim+json'
    },
    method: 'POST',
    data: {
      userId: userId,
      email: email,
      mobile: mobile
    },
    url: `${BASE_URL}/yphf/user-registration/1.0.0/initiate`
  };

  return httpRequest(requestConfig)
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function verifyPhone(userId, email, mobile, httpRequest) {
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/scim+json'
    },
    method: 'POST',
    data: {
      userId: userId,
      email: email,
      mobile: mobile
    },
    url: `${BASE_URL}/yphf/user-registration/1.0.0/verify`
  };

  return httpRequest(requestConfig)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}
