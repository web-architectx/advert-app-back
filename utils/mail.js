import { createTransport } from "nodemailer";


export const mailtransporter = createTransport({
    host: 'smtp.gmail.com',
    port:'465',
    secure:true,
    auth:{
        user: 'romeoasante66@gmail.com',
        pass:'avcnsoulzylscmsu'
    },
    from: 'romeoasante66@gmail.com'
})