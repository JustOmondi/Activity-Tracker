import { Button, Form, Input, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { INCORRECT_CREDENTIALS, SUCCESS } from '../Config'
import { setLoggedIn } from '../app/mainSlice'
import useAuth from '../hooks/useAuth'

export default function LoginPage() {
    const [loginError, setloginError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [errorMessage, setErrorMessage] = useState(INCORRECT_CREDENTIALS)

    const dispatch = useDispatch()

    const { getNewTokens, tokenFound } = useAuth()

    useEffect(() => {
        if (tokenFound) {
            window.location.replace('/app/dashboard');
        }
    }, [])

    const onFinish = async (values) => {
        setLoading(true)

        const message = await getNewTokens(values)

        if (message === SUCCESS) {
            setloginError(false)
            setErrorMessage('')
            dispatch(setLoggedIn(true))
            window.location.replace('/app/dashboard')

        } else {
            setloginError(true)
            setErrorMessage(message)
        }

        setLoading(false)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleFieldsChange = () => {
        if (loginError) {
            setloginError(false)
            setErrorMessage('')
        } else {
            setErrorMessage(INCORRECT_CREDENTIALS)
        }
    }

    return (
        <div className='page h-full pt-8 px-6'>
            <div className='page-inner overflow-auto w-full flex flex-col items-center justify-center'>
                <img className='w-20' alt='Logo' src="/logo.png" />
                <h1 className='font-bold text-[2em] xl:text-[2em] mb-10'>Welcome!</h1>
                {loginError && <h2 className='font-medium text-md mb-10 text-red-600'>{errorMessage}</h2>}
                <div className='subgroup-card shadow-lg bg-white rounded-3xl flex flex-col items-center w-autoflex-wrap p-10'>
                    {tokenFound && <Skeleton.Input active />}
                    {!tokenFound && (
                        <Form
                            name="basic"
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            onFieldsChange={handleFieldsChange}
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
