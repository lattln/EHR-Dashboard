import React, { createContext, useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";

const UserContext = createContext();

const UserProvider = ({children}) => {
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
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

const useUser = () => {
    return useContext(UserContext);
};

export { UserProvider, useUser };