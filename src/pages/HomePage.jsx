import React, { useEffect } from 'react';
import { useAuthContext, Hooks } from '@asgardeo/auth-react';
import { useHistory } from 'react-router-dom';
import BusinessPlansSection from '../layouts/BusinessPlansSection';
import DealsSection from '../layouts/DealsSection';
import EntertainmentSection from '../layouts/EntertainmentSection';
import Hero from '../layouts/Hero';
import QuickActionsSection from '../layouts/QuickActionsSection';
import UnlimitedPlansSection from '../layouts/UnlimitedPlansSection';
import WebPage from '../templates/WebPage';

const HomePage = () => {
  const { on, state, signIn } = useAuthContext();
  const history = useHistory();

  useEffect(() => {
    console.log(sessionStorage.getItem('isAuth'));
    if (sessionStorage.getItem('isAuth') !== null) {
      history.push('/my-kfone');
      return;
    }
  }, []);

  useEffect(() => {
    on(Hooks.SignIn, () => {
      history.push('/my-kfone');
      sessionStorage.setItem('isAuth', true);
    });
  }, [on]);

  const handleLogin = () => {
    signIn();
  };

  return (
    <WebPage handleLogin={handleLogin} state={state}>
      <Hero />
      <QuickActionsSection />
      <DealsSection />
      <UnlimitedPlansSection />
      <BusinessPlansSection />
      <EntertainmentSection />
    </WebPage>
  );
};

export default HomePage;
