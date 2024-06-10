import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddHeader() {
    const initialValues = {
        coda_token: "",
        clockify_token: "",
        username: ""
    }

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        coda_token: Yup.string().required(),
        clockify_token: Yup.string().required(),
        username: Yup.string().min(3).max(15).required(),
    })

    const onSubmit = (data) => {
        axios.post("http://localhost:5000/headers", data).then((response) => {
            console.log("IT WORKED");
            navigate('/')
        });
    };

    return (
        <div className='container py-5' >
            <Formik className="items-center text-center" initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='form'>
                    <label htmlFor="coda_token">Coda Token : </label>
                    <br />
                    <small><ErrorMessage name='coda_token' component="span" className='error_msg' /></small>
                    <br />
                    <Field id="coda_token" name="coda_token" placeholder="Input your coda token" className="input input-bordered isi" />
                    <br />
                    <br />
                    <label htmlFor="clockify_token">Clockify Token : </label>
                    <br />
                    <small><ErrorMessage name='clockify_token' component="span" className='error_msg' /></small>
                    <br />
                    <Field id="clockify_token" name="clockify_token" placeholder="Input your clockify token" className="input input-bordered isi" />
                    <br />
                    <br />
                    <label htmlFor="username">Username </label>
                    <br />
                    <small><ErrorMessage name='username' component="span" className='error_msg' /></small>
                    <br />
                    <Field id="username" name="username" placeholder="Input your name" className="input input-bordered isi" />
                    <br />
                    <button className='btn btn-warning mt-3 w-full' type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default AddHeader