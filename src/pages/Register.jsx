import React from 'react';
import RegisterNav from '../components/register/registerNav';
import FormField from '../components/register/formField';
import Footer from '../components/home/footer';

const Register = () => {
  return (
    <div className="bg-black min-h-screen">
        <RegisterNav />
        <section id="form">
            <FormField />
        </section>
        <section id="footer">
            <Footer />
        </section>
            </div>
  )
}

export default Register