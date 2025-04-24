import { getToken } from "../../api/FitBit/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../User";

const Token = ({}) => {
    const [urlParams] = useSearchParams();
    const nav = useNavigate();
    const { user, userLoading } = useUser();

    useEffect(() => {
        const authorizeToken = async () => {
            let success = await getToken(urlParams.get('code'), urlParams.get('state'));
            if(success.success){
                await Meteor.callAsync('user.updateProfile', {
                    ...user.profile,
                    fitbitAccountAuth: success.token
                })
                nav('/patient/settings');
            } else {
                console.log(success.errors);
                nav('/not-found');
            }
        }

        if(!userLoading){
            authorizeToken();
        }
    }, [userLoading])
    return;
}

export default Token;