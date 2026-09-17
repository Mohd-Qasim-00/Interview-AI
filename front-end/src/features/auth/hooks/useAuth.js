import {useContext} from "react"
import {AuthContext} from "../auth.context"

import {login,register,logout,getMe} from "../services/auth.api"

export const useAuth = () => {
    const {user, setUser, loading, setLoading} = useContext(AuthContext)
   

const handleLogin = async ({email, password}) => {
    setLoading(true)
    try {
        const Data = await login({email, password})
        setUser(Data.user)
    } catch (error) {
        console.error("Login failed:", error)
        throw error
    } finally {
        setLoading(false)
    }
}


const handleRegister = async ({username, email, password}) => {
    setLoading(true)
    try {
        const Data = await register({username, email, password})
        setUser(Data.user)
    } catch (error) {
        console.error("Register failed:", error)
        throw error
    } finally {
        setLoading(false)
    }
}


const handleLogout = async () => {
    setLoading(true)
    try {
        await logout()
        setUser(null)
    } catch (error) {
        console.error("Logout failed:", error)
    } finally {
        setLoading(false)
    }



}

return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    getMe
}

}
