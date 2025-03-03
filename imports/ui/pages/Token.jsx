import { getToken, isValidToken, refreshToken } from "../../api/FitBit/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Token = ({}) => {
    const [urlParams] = useSearchParams();
    const nav = useNavigate();

    useEffect(() => {
        const authorizeToken = async () => {
            let success = await getToken(urlParams.get('code'));
            if(success.success){
                nav('/user');
            } else {
                console.log(success.errors);
                nav('/not-found');
            }
        }

        const refresh = async () => {
            let success = await refreshToken();
            if(success.success){
                nav('/user');
            } else {
                console.log(success.errors);
                nav('/not-found');
            }
        }
        if(!isValidToken()){
            authorizeToken();
            return;
        } else {
            refreshToken();
        }
    }, [])
    return;
}

export default Token;