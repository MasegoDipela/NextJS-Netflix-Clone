/**Import a compenent that was developed in the apps 'components' folder */
import axios from "axios";
import Input from "@/components/input";
import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";

const Auth = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

//Create a varient toggle method in order to switch between 'Sign in' and 'Sign Up' 
const [variant, setVariant] = useState('sign in');
const toggleVariant = useCallback(() =>{
    setVariant((currentVariant) => currentVariant == 'sign in' ? 'sign up': 'sign in');
},[]);

// Create function to sign in the user
const login = useCallback( async () => {
    try{
        await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/'
        });
        
        router.push('/')
    } catch(error) {
        console.log(error);
    }

}, [email, password, router]);

// Create function to register user
const register = useCallback(async() => {
    try{
        await axios.post('/api/register', {
            email,
            name,
            password
        });
        
        //After registeringthe user log them in automatically by calling the login fuction
        login();
    } catch(error) {
        console.log(error);
    }
}, [email, name, password, login]);


    return (
        /** 1. Let an image represent the background of the authentication page 
        2. Make the background image darker by overlying a black background at 50% opacity
        3. Create a "Sign in" card that imports two input text fields from the "components" folder of the app*/
        <div className=" relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg fixed bg-cover">
            <div className="bg-black h-full w-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="Abi-Pod logo" className="h-12"/>
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg: w-2/5 lg:max-w-md rounded-md  w-full">
                        <h2 className="text-white text-4xl mb-8 font semibold">
                            {variant == 'sign in' ? 'Sign In' : 'Sign Up'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant =='sign up' &&(
                            <Input 
                                label="Username"
                                onChange={(ev: any) => setName(ev.target.value)}
                                id="name"
                                value={name}
                            />
                            )}
                            <Input 
                                label="Email"
                                onChange={(ev: any) => setEmail(ev.target.value)}
                                id="email"
                                type="email"
                                value={email}
                            />
                             <Input 
                                label="Password"
                                onChange={(ev: any) => setPassword(ev.target.value)}
                                id="password"
                                type="password"
                                value={password}
                            />
                        </div>
                        <button onClick={variant == 'sign in' ? login : register } className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                            {variant == 'sign in' ? 'Sign in': 'Sign up' }
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant == 'sign in' ? 'New to Netflix?' : 'Already have an account?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant == 'sign in' ? 'Create an account.' : 'Sign in.'}
                            </span>
                        </p>
                    </div>
                </div> 
            </div>
        </div>

    );
}

export default Auth;