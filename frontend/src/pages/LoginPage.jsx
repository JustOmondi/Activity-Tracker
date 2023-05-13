import { Button, Form, Input, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { BASE_API_URL, COOKIE_MAX_AGE_DAYS, HTTP_200_OK, TOKEN_COOKIE_NAME } from '../Config';
import { getCookieValue } from '../utils';

export default function LoginPage() {
    const [loginError, setloginError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tokenFound, setTokenFound] = useState(true)

    useEffect(() => {
        const token = getCookieValue(TOKEN_COOKIE_NAME)

        if (token) {
            window.location.replace('/app/dashboard');
        } else {
            setTokenFound(false)
        }
    }, [])


    const onFinish = (values) => {
        const url = `${BASE_API_URL}/login`

        setLoading(true)
        setloginError(false)

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                setLoading(false)

                if (response.status === HTTP_200_OK) {
                    const data = await response.json()
                    document.cookie = `${TOKEN_COOKIE_NAME}=${data[TOKEN_COOKIE_NAME]}; max-age=${COOKIE_MAX_AGE_DAYS * 24 * 3600}`
                    window.location.replace('/app/dashboard');
                } else {
                    setloginError(true)
                }
            })
            .catch(error => {
                setLoading(false)
                setloginError(true)
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    return (
        <div className='page h-full pt-8 px-6'>
            <div className='page-inner overflow-auto w-full flex flex-col items-center justify-center'>
                <img className='w-20' alt='Logo' src="/logo.png" />
                <h1 className='font-bold text-[2em] xl:text-[2em] mb-10'>Welcome!</h1>
                {loginError && <h2 className='font-medium text-md mb-10 text-red-600'>Username or password incorrect, please try again</h2>}
                <div className='subgroup-card shadow-lg bg-white rounded-3xl flex flex-col items-center w-autoflex-wrap p-10'>
                    {tokenFound && <Skeleton.Input active />}
                    {!tokenFound && (
                        <Form
                            name="basic"
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off">
                            <Form.Item
                                label=""
                                name="username"
                                rules={[{ required: true, message: 'Please input your username' }]}
                            >
                                <Input placeholder='Username' />
                            </Form.Item>

                            <Form.Item
                                label=""
                                name="password"
                                rules={[{ required: true, message: 'Please input your password' }]}
                            >
                                <Input.Password placeholder='Password' />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className='bg-black text-white shadow-md flex items-center mt-6 w-full justify-center'
                                    type='primary'
                                    loading={loading}
                                    htmlType="submit"
                                    size='large'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                </div>


            </div>
        </div>
    )
}
