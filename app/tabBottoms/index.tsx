import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import Settings from '../Screens/Settings';

const TabBottoms = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};
export default TabBottoms;
