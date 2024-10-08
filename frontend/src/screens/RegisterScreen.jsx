import {React, useState,useEffect } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import {setCredentials} from '../slices/authSlice';
import {toast} from 'react-toastify';


const RegisterScreen = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    useEffect(()=> {
      if(userInfo){
        navigate(redirect);
      }
    },[userInfo,redirect, navigate])


    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }else {
       try {
            const res = await register({name, email, password}).unwrap();
            dispatch(setCredentials({...res}));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
        }
      
    }
  return <FormContainer>
    <h1>Đăng Ký</h1>

       

    <Form onSubmit={submitHandler}>
     <Form.Group controlId="name" className="my-3">
            <Form.Label>
                Tên
            </Form.Label>
            <Form.Control type="text" placeholder="Nhập tên" value={name} onChange={(e)=>setName(e.target.value)}>

            </Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
            <Form.Label>
                Email
            </Form.Label>
            <Form.Control type="email" placeholder="Nhập email" value={email} onChange={(e)=>setEmail(e.target.value)}>

            </Form.Control>
        </Form.Group>

       <Form.Group controlId="password" className="my-3">
            <Form.Label>
                Mật Khẩu
            </Form.Label>
            <Form.Control 
            type="password" 
            placeholder="Nhập Mật Khẩu" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}>

            </Form.Control>
        </Form.Group>

        
       <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>
               Nhập Lại Mật Khẩu
            </Form.Label>
            <Form.Control 
            type="password" 
            placeholder="Nhập Lại Mật Khẩu" 
            value={confirmPassword} 
            onChange={(e)=>setConfirmPassword(e.target.value)}>

            </Form.Control>
        </Form.Group>
        
        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
            Đăng Ký 
        </Button>
        {isLoading && <Loader/>}
    </Form>
    <Row className="py-3">
        <Col>
       Đã có tài khoản? <Link to={redirect ? `/login?redirect=${redirect}`:'/login'}>Đăng Nhập</Link>
        </Col>
    </Row>
  </FormContainer>;
};

export default RegisterScreen;
