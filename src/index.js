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
            clientID: "CEDMJLv2QaIN2pdZKxSu1ObCuAMa",
            baseUrl: "https://api.asgardeo.io/t/hasintha",
            scope: [ "openid","profile" ]
   } }
 >
   <App />
 </AuthProvider>

);

root.render(<Index />);


