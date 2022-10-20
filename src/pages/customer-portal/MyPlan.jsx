import MyPlanWithAuth from './MyPlanWithAuth';
import MyPlanWithOutAuth from './MyPlanWithoutAuth';
import { useAuthContext } from '@asgardeo/auth-react';

const MyPlan = () => {
  if (!useAuthContext()) {
    return <MyPlanWithOutAuth />;
  }

  return <MyPlanWithAuth />;
};

export default MyPlan;
