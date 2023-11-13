import jwtService from '@/services/JwtService';
import {jwtDecode} from 'jwt-decode'

const useAuth = () => {
    const token = jwtService.getToken();

    if (token) {
        const decoded : any = jwtDecode(token)
        const user_id = decoded.user_id
        return { user_id , hasToken : true }
    }
    return { user_id : null , hasToken : false }
}
export default useAuth