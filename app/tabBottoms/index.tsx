import {createBottomTabNavigator, TransitionPresets} from '@react-navigation/bottom-tabs';
import Settings from '../Screens/Settings';
import HomeStack from '../StackScreen/HomeStack';

const screenOptions = {
  headerTitle: '',
  headerShown: false,
};
const TabBottoms = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName='HomeTab' screenOptions={screenOptions}>
      <Tab.Screen name="HomeTab" component={HomeStack}/>
      <Tab.Screen name="SettingsTab" component={Settings} />
    </Tab.Navigator>
  );
};
export default TabBottoms;
