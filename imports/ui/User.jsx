import React, { createContext, useContext, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [presetName, setPresetName] = useState('Preset 1');
    const user = useTracker(() => {
        const userSub = Meteor.subscribe("userData");
        const id = Meteor.userId();
        return {
            userLoading: !userSub.ready(),
            user: Meteor.user(),
            id: id
        }
    });



    return (
        <UserContext.Provider value={{ user, presetName, setPresetName }}>
            {children}
        </UserContext.Provider>
    );
}

const useUser = () => {
    let u = useContext(UserContext);
    return u; 
};

export { UserProvider, useUser };