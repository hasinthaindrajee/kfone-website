import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from '@asgardeo/auth-react';


const root = ReactDOM.createRoot(document.getElementById('root'));

const Index = () => (

 <AuthProvider
   config={ {
	    signInRedirectURL: "https://localhost:3001/my-kfone",
            signOutRedirectURL: "https://localhost:3001/my-kfone",
            clientID: "tkIiux97G_KcoXMQ5m0_MXS3uNEa",
            baseUrl: "https://api.asgardeo.io/t/kfone",
            scope: [ "openid","profile" ]
   } }
 >
   <App />
 </AuthProvider>

);

root.render(<Index />);


