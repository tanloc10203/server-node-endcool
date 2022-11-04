'use strict';
require('dotenv').config();
import * as nodemailer from 'nodemailer';
import { PayloadEmail } from '../utils';

export const emailService = {
  async sendEmailVerifyChangePw(dataSend: PayloadEmail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"End Cool 👻" <ginga550504@gmail.com>', // sender address
      to: dataSend.sendEmail, // list of receivers
      subject: 'Xác thực thay đổi mật khẩu', // Subject line
      html: emailService.handleHtmlLang(dataSend),
    });
  },

  handleHtmlLang(dataSend: PayloadEmail): string {
    return `
    <h1>Xác nhận email và thay đổi mật khẩu</h1>
    <p>Xin chào. ${dataSend.data.lastName}</p>
    <p>Tài khoản đăng nhập của bạn là: <b>${dataSend.data.username}</b></>
    <p>Bạn nhận được email này vì đã quên mật khẩu và muốn thay đổi mật khẩu</p>
    <p style="color: red">Nếu những thông tin trên là chính xác. Vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục thay đổi mật khẩu</>
    <div><a href=${dataSend.urlVerify} target="_blank"><strong>Link xác nhận</strong></a></div><br>
    <div><strong><i>Xin chân thành cảm ơn!</i></strong></div>
    `;
  },
};
