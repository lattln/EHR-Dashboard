import { getToken } from "../../api/FitBit/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Token = ({}) => {
    const [urlParams] = useSearchParams();
    const nav = useNavigate();

    useEffect(() => {
        const authorizeToken = async () => {
            let success = await getToken(urlParams.get('code'));
            if(success.success){
                nav('/settings');
            } else {
                console.log(success.errors);
                nav('/not-found');
            }
        }

        authorizeToken();
    }, [])
    return;
}

export default Token;