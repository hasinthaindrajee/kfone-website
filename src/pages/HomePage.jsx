import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useHistory } from 'react-router-dom';
import BusinessPlansSection from '../layouts/BusinessPlansSection';
import DealsSection from '../layouts/DealsSection';
import EntertainmentSection from '../layouts/EntertainmentSection';
import Hero from '../layouts/Hero';
import QuickActionsSection from '../layouts/QuickActionsSection';
import UnlimitedPlansSection from '../layouts/UnlimitedPlansSection';
import GeneralTemplate from '../templates/GeneralTemplate';

const HomePage = () => {
  const { state, signIn, trySignInSilently } = useAuthContext();
  const { isAuthenticated } = state;
  const history = useHistory();

  const handleLogin = () => {
    // If the user is already authenticated, send them to the portal
    // without re-initiating the authentication flow.
    if (isAuthenticated) {
      navigateToPortal();
      return;
    }

    trySignInSilently()
      .then((response) => {
        if (!response) {
          signIn();
        }
      })
      .catch(() => {
        signIn();
      });
  };

  const navigateToPortal = () => {
    history.push('/my-kfone');
  };

  return (
    <GeneralTemplate handleLogin={handleLogin} state={state}>
      <Hero />
      <QuickActionsSection />
      <DealsSection />
      <UnlimitedPlansSection />
      <BusinessPlansSection />
      <EntertainmentSection />
    </GeneralTemplate>
  );
};

export default HomePage;
